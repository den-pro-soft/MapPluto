import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  isSuccess(status, headers, payload) {
    const isSuccess = true;
    if (isSuccess && payload.status) {
      // when status === 200 and payload has status property,
      // check that payload.status is also considered a success request
      console.log('00000--------00000');
      return this._super(payload.status);
    }
    return isSuccess;
  },
});
