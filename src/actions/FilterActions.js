import alt from '../alt';

const FilterActions = {

  generate: ['toggleFilterTag', 'submitFilter', 'onFilterQueryChange', 'clearFilter']

}

export default alt.createActions('FilterActions', FilterActions);
