console.log("1등");

const hi = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("good");
  }, 2000);
});

hi.then((res) => console.log(res)).catch((err) => console.log(err));

console.log("3등");
