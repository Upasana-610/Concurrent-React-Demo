## 🧠 If we understand this project :
    
We will have clear concept about Promises, resolve, reject, .then(), .catch(), .finally(), callbacks, Javascript event loop ( call stack, WebAPI, task queue, microtask queue), useEffect hook, lazy loading, code spittling, Suspense, Javascript single threaded nature, Javascript asynchronous nature, concurrent React ( useTransition and useDeferredValue), Virual DOM, setInterval, setTimeouts, props, components, destructuring, etc.

😊 Please read the code and follow along to understand what is happening. Feel free to reach out to me at upasanapan610@gmail.com if you have any thoughts or would just like to connect.
Thank you!


## 🧠 Understanding How React Concurrent Mode Works in This Project

---
<img width="1919" height="871" alt="image" src="https://github.com/user-attachments/assets/030f486e-ef08-4166-8328-19728145d6a0" />

1. **Initial Render**:  
   React creates a Virtual DOM tree from the JSX and uses this to render the real DOM for the first time. The state of the `isOn` variable is initialized as `false`. Thus, we see "button clicks in call stack" in the console.
---
   **Microtask queue** runs:  
   - `Promise` callbacks (`.then()`, `.catch()`, `.finally()`)  
   - `async/await`  
   - `queueMicrotask`  
   - `MutationObserver` callbacks  



2. `fetchUser` function is called inside `useEffect([])` — it returns a `Promise`.  
   The `Promise` triggers `setTimeout` which runs in the Web API and expires after 3 seconds. Then, the resolve function is queued in the **macrotask/task queue**. Once the call stack is empty, this resolve is executed and returns the Promise to `fetchUser`.

---

3. The `.then()` attached to `fetchUser()` is queued in the **microtask queue**. Once the call stack is empty, `.then()` is executed and triggers `setUser()` via `useState`, which goes into the call stack.

---

4. Just before the two cards **Roshni** and **Upasana** load, we see "Loading components..." before the search input field appears.  
   This is due to **lazy loading** of the `SearchableUsers` component in `App.js`.

---

5. When React hits a lazy component, it inserts the `fallback` (within `<Suspense>`) into the **Virtual DOM**. Meanwhile, the actual JS file for the lazy-loaded `SearchableUsers` component is being loaded asynchronously. Once done, React replaces the fallback in the Virtual DOM with the actual component, diffs with the previous Virtual DOM, and only applies changes to the real DOM.

---

6. Then the **Search input field appears**, and we see "Loading search results...".  
   This is due to the **lazy loading** of the `UserCard` component inside `SearchableUsers.js`.

---

7. Then, finally, the **User Cards appear**.

---
[🎥 Watch Demo on Vimeo](https://vimeo.com/1105335586)
8. On clicking the **“Turn Off”** button, infinite auto-clicking of the toggle button starts at 1ms intervals.

---

9. So now, the **call stack is not empty**. The event loop keeps triggering button click handlers into the call stack one by one.

---

10. On clicking the **“Fetch Slow Posts”** button, the function `slowPostsLoad()` is called, which internally triggers `fetchSlow()`.  
    This simulates a heavy API call and is synchronous + blocking. It returns JSX.  
    Button clicks **stop briefly** (as they're queued in the task queue).

---

11. ✅ Now we have two scenarios:

---

### 🔹 A. **Without `startTransition`**

12. `setSlowPosts()` inside `slowPostsLoad()` triggers rendering.  
    Almost **simultaneously**, another trigger from button click occurs.  
    So both `setSlowPosts` and the toggle button click get rendered in the **same frame**, but **before allowing more clicks** (queued in task queue), the entire render (slow posts + one button click) gets completed.

---

13. Then button clicking **resumes** after slow posts are rendered.

---

14. ❌ The **issue here** is: UI **freezes** while slow posts are rendering.  
    Button hangs = bad UX.

---

### 🔹 B. **With `startTransition`**

15. Wrapping `setSlowPosts` inside `startTransition()` marks it as **low priority**.  
    So after `fetchSlow()` completes, button clicks (which are **high priority**) are allowed to run first.

---

16. While the `startTransition` code hasn’t yet completed, `isPending` remains `false`, and we see "Loading Posts...".

---

17. Button click triggers **keep executing**.  
    But we can’t starve any low-priority task forever.  
    Between React frames, when there's **idle time**, the low-priority `startTransition()` render executes. Button clicks **pause briefly** at this point.

    ✅ This keeps UI responsive **without blocking** background rendering.

---

18. Button clicks then **resume** again.

---

## 🔁 How `useDeferredValue` Works in SearchableUsers.jsx

In this component, we use `useDeferredValue` to make the **search input smoother**, especially when the list of users grows larger.

Let’s walk through how it works step by step:

---

### 1. Input State Declaration
```js
const [input, setInput] = useState("");
```
This holds the user’s immediate input — updated **on every keystroke**.

---

### 2. Creating a Deferred Version
```js
const deferredInput = useDeferredValue(input);
```
This means:  
➡️ React will **wait briefly** before updating `deferredInput` during high-priority renders (like typing).  
➡️ This avoids blocking urgent updates (like typing feedback, cursor movement, etc.) with slow operations (like filtering/rendering user cards).

---

### 3. Handling Input Changes
```js
onChange={(e) => setInput(e.target.value)}
```
The `input` state changes **immediately**, but `deferredInput` **lags behind slightly**.

---

### 4. Filtering Logic
```js
const filteredUsers = users.filter((user) =>
  user.name.toLowerCase().includes(deferredInput.toLowerCase())
);
```
So instead of filtering on every keystroke, React **waits until it’s idle** and then runs this logic using the deferred value.

---

### 5. Rendering Filtered Users
```js
<Suspense fallback={<p>Loading search results...</p>}>
  {filteredUsers.map((user) => (
    <UserCard key={user.id} user={user} />
  ))}
</Suspense>
```
If the list is big and React is still lazy-loading `UserCard`, it shows a loading message.

---

### ✅ Why This is Useful
- **Without `useDeferredValue`**:  
  Every keystroke causes the entire list to re-filter and re-render instantly.  
  If `UserCard` is slow (lazy-loaded), typing lags badly.

- **With `useDeferredValue`**:  
  Typing stays **snappy and responsive**, and rendering is **deferred** slightly — enough to keep the UI smooth.

---

### 🧠 TL;DR
> `useDeferredValue` helps React **decouple typing speed** from **heavy rendering work**. It ensures the UI stays smooth and responsive while filtering or rendering a large number of components like `UserCard`.



### 💡 Summary

This project demonstrates how React’s **Concurrent Mode** helps with smoother rendering under load by using:

- `React.lazy` and `Suspense` for **code-splitting**  
- `startTransition()` to mark **non-urgent updates** as low priority  
- Event loop behavior, **task queues**, and **microtask queues**  
- `useRef` for safe interval management  
- `useTransition` and `isPending` , `useDeferredValue` for **responsive UI** rendering

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

---

