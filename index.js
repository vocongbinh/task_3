const axios = require("axios");
const { inputUrl, outputUrl } = require("./request");

async function getInput() {
  try {
    const res = await axios({
      method: "GET",
      url: inputUrl,
    });
    return res.data;
  } catch (e) {
    console.log("Error: ", e);
  }
}
function calculateQuery(range, data, type) {
  let startIndex, endIndex;
  if (range[0] >= range[1]) {
    startIndex = range[1];
    endIndex = range[0];
  } else {
    startIndex = range[0];
    endIndex = range[1];
  }
  let total = 0;
  for (var i = startIndex; i <= endIndex; i++) {
    if (type == "1") {
      total += data[i];
    } else {
      i % 2 == 0 ? (total += data[i]) : (total -= data[i]);
    }
  }
  return total;
}

async function output() {
  const responseData = await getInput();
  const data = responseData.data;
  const token = responseData.token;
  const query = responseData.query;
  const result = query.map((queryData) => {
    return calculateQuery(queryData.range, data, queryData.type);
  });
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  console.log("result: ", result);
  await axios
    .post(outputUrl, result, { headers })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
output();
