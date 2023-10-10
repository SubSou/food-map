async function dummy() {
  try {
    const res = await axios({
      method: "get", // http method
      url: "http://localhost:3000/restaurants",
      headers: {}, // packet header
      data: {}, // packet body
    });

    console.log(res);
  } catch (err) {
    console.error(err);
  }
}

dummy();
