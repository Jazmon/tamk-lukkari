import React from 'react';
import {
  View,
  ActivityIndicator,
  WebView,
} from 'react-native';

const url = 'http://www.campusravita.fi/ruokalista';
const injectedJavaScript =
`(function hideElements() {
  var asides = document.getElementsByTagName('aside');
  Array.prototype.forEach.call(asides, function(aside) {
    aside.innerHTML = '';
  });
  var header = document.getElementsByClassName('container header')[0];
  header.innerHTML = '';
  header.style.padding = 0;
  document.getElementsByClassName('navbar-header')[0].innerHTML = '';
  document.getElementById('navbar').style.minHeight = 0;
  var css = '.main-container > .row { padding: 30px 0 40px 0; }';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
}());`;

// eslint-disable-next-line react/prefer-stateless-function
export default class Lunch extends React.Component {

  render() {
    return (
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        automaticallyAdjustContentInsets={true}
        startInLoadingState={true}
        renderLoading={() =>
          <View style={{ flex: 1 }}>
            <ActivityIndicator animating={true} color="#f44336" size="large" />
          </View>
        }
        javaScriptEnabled={true}
        injectedJavaScript={injectedJavaScript}
      />
    );
  }
}
