// @flow
import moment from 'moment';

const apiDateFormat = 'YYYY-MM-DDTHH:mm';
const apiUrl = 'https://opendata.tamk.fi/r1/reservation/search';

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

// eslint-disable-next-line arrow-parens, arrow-body-style
export const fetchLessons = ({
  studentGroup,
  realization,
  type = 'week',
}: {
  studentGroup?: Array<string>;
  realization?: string;
  type: TimeType;
}): Promise<*> =>
  new Promise((resolve, reject) => {
    console.log('request body', JSON.stringify({
      studentGroup,
      realization,
      rangeStart: moment().startOf(type).format(apiDateFormat),
      rangeEnd: moment().endOf(type).format(apiDateFormat),
    }));
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'fi', // TODO localize
        Authorization: 'Basic V3U0N3p6S0VQYTdhZ3ZpbjQ3ZjU6',
      },
      body: JSON.stringify({
        studentGroup,
        realization: realization ? [realization] : undefined,
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
