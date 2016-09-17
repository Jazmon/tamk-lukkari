// @flow

import React from 'react';
import {
  AppRegistry,
} from 'react-native';

import App from './App';

console.log = console.log.bind(null, '[Lukkari]'); // eslint-disable-line
const Lukkari = () => (<App />);

AppRegistry.registerComponent('Lukkari', () => Lukkari);
