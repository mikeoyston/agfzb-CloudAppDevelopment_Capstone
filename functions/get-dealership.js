const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");

function main(params) {
  const authenticator = new IamAuthenticator({ apikey: params.IAM_API_KEY });
  const cloudant = CloudantV1.newInstance({
    authenticator: authenticator,
  });
  cloudant.setServiceUrl(params.COUCH_URL);
  console.log(params)

  if (params.state) {
    selector = { state: params.state };
  } else if (params.dealerId) {
    selector = { id: parseInt(params.dealerId) };
  } else {
    selector = {};
  }

  let dealerListPromise = getMatchingRecords(cloudant, "dealerships", selector);
  return dealerListPromise;
}

function getMatchingRecords(cloudant, dbname, selector) {
  return new Promise((resolve, reject) => {
    cloudant
      .postFind({ db: dbname, selector: selector })
      .then((result) => {
        resolve({ result: result.result.docs });
      })
      .catch((err) => {
        console.log(err);
        reject({ err: err });
      });
  });
}