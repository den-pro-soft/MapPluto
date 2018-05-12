import DS from 'ember-data';

export default DS.Model.extend({
  link_info: DS.attr('string'),
  cache_info: DS.attr('string'),
});
