import Ember from 'ember';
import { computed } from 'ember-decorators/object'; // eslint-disable-line

function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = (name + '=' + (value || '') + expires + ';domain=.nyc.gov;path=/');
  // document.cookie = (name + '=' + (value || '') + expires + 'nycprop.nyc.gov;path=/');
}

export default Ember.Component.extend({
  ajax: Ember.inject.service(),
  scrape_link: '',

  @computed('lot.borough', 'lot.lot', 'lot.block', 'lot.address', 'lot.zipcode', 'lot.ownername')
  get lotdata() {
    const data = [6];

    data[0] = this.get('lot.borocode');
    data[1] = this.get('lot.block');
    data[2] = this.get('lot.lot');
    data[3] = this.get('lot.address');
    data[4] = this.get('lot.zipcode');
    data[5] = this.get('lot.ownername');

    return data;
  },
  actions: {
    getNYCinfos() {
      const dataParam = this.get('lotdata');
      let win = '';
      const param = {
        borocode: dataParam[0],
        block: dataParam[1],
        lot: dataParam[2],
        address: dataParam[3],
        zipcode: dataParam[4],
        ownername: dataParam[5],
      };

      $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/api/scrape-site',
        async: false,
        data: JSON.stringify(param),
        success: function(response) {
          console.log(response);
          setCookie(response.cookie.split('=')[0], response.cookie.split('=')[1], 7);
          $.scrape_link = response.link.replace('../..', 'http://nycprop.nyc.gov/nycproperty');
          console.log($.scrape_link);
        },
      });
      var el = document.getElementById('new-Page');
      el.href = $.scrape_link;
      // el.onclick = true;
    },
  },
});
