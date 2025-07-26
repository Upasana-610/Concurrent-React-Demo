//Simulated API

export const fetchUsers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Upasana", bio: "Frontend Dev" },
        { id: 2, name: "Roshni", bio: "Backend Lead" },
        { id: 3, name: "Roshan", bio: "ML Enthusiast" },
      ]);
      
    }, 3000); //simulate slow network
  });
};

export const fetchSlow = () => {
  // Log once. The actual slowdown is inside SlowPost.
  console.log(
    '[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />',
  );

  let items = [];
  for (let i = 0; i < 2500; i++) {
    console.log("fetch slow function running in call stack")
    items.push(<SlowPost key={i} index={i} />);
  }
  return <ul className='items'>{items}</ul>;
};

const SlowPost = ({ index }) => {
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return <li className='item'>Post #{index + 1}</li>;
};

// A Promise is a JavaScript object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. States : PENDING, FULFILLED REJECTED

/* Callback : A callback is a function that is passed as an argument to another function 

Because JavaScript is asynchronous (non-blocking), callbacks allow you to:

- Wait for data (like from an API)

- React to events (like a button click)

- Run code after something else finishes

example:

function greet(name) {
  console.log("Hello, " + name);
}

function processUser(callback) {
  const userName = "Upasana";
  callback(userName);  // ← callback is called here
}

processUser(greet); // Output: Hello, Upasana
*/

/*
.then() -> method on the Promise prototype,
registers callbacks to be called after a Promise is resolved.

.catch() -> when promise rejected
*/

/*
resolve() and reject() -> functions provided by the Promise constructor in JavaScript
*/