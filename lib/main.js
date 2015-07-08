import React from 'react';
import { Agenda } from './Agenda'
import Loading from 'react-loading'

const scripts = document.querySelectorAll('script[src*="koliseo-agenda.js"][data-url]');

window.K = window.K || {};
K.agenda = {};

K.agenda.render = function(url, $elem, {
  loading = {
    type: 'cubes',
    color: '#e3e3e3'
  }
} = {}) {

  fetch(url)
  React.render(<Loading type={loading.type} color={loading.color}/>, $elem || document.querySelector('.koliseo-agenda'));
}
export default K.agenda;
