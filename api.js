// @flow
import moment from 'moment';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  // $FlowIssue
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}
type TimeType = 'today' | 'week';
const apiDateFormat = 'YYYY-MM-DDTHH:mm';
const apiUrl = 'https://opendata.tamk.fi/r1/reservation/search';
// eslint-disable-next-line arrow-parens, arrow-body-style
export const fetchLessons = ({
  studentGroup,
  realization,
  type = 'week',
}: {
  studentGroup?: Array<string>;
  realization?: Array<string>;
  type: TimeType;
}): Promise<*> =>
  new Promise((resolve, reject) => {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'fi', // TODO localize
        Authorization: 'Basic V3U0N3p6S0VQYTdhZ3ZpbjQ3ZjU6',
      },
      body: JSON.stringify({
        studentGroup,
        realization,
        rangeStart: moment().startOf(type).format(apiDateFormat),
        rangeEnd: moment().endOf(type).format(apiDateFormat),
      }),
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => resolve(data))
    .catch(error => reject(error));
  });

export const blazeIt = 420;

/*
var data = JSON.stringify({
  "studentGroup": [
    "13TIKOOT"
  ],
  "startDate": "2016-09-17T09:00"
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://opendata.tamk.fi/r1/reservation/search");
xhr.setRequestHeader("content-type", "application/json");
xhr.setRequestHeader("accept-language", "fi");
xhr.setRequestHeader("authorization", "Basic V3U0N3p6S0VQYTdhZ3ZpbjQ3ZjU6");
xhr.setRequestHeader("cache-control", "no-cache");
xhr.setRequestHeader("postman-token", "bd719dab-a5cd-a674-fb62-085d3a7cb1af");

xhr.send(data);
*/
