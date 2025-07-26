// src/App.js
import React, {
  useEffect,
  useState,
  Suspense,
  useTransition,
  useRef,
} from "react";
import { fetchSlow, fetchUsers } from "./api/users";
import "./App.css";

const SearchableUsers = React.lazy(() =>
  import("./components/SearchableUsers")
);

function App() {
  const [users, setUsers] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [slowPosts, setSlowPosts] = useState(null);

  const buttonRef = useRef();
  const intervalStarted = useRef(false); // ✅ Prevents multiple intervals
  const hasInteracted = useRef(false); // ✅ Tracks first manual interaction
  const intervalId = useRef(null);

  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    console.log("button clicks in call stack");
  }, [isOn]);

  useEffect(() => {
    if (slowPosts) {
      console.log("Slow Posts in callstack");
      console.log(slowPosts);
    }
  }, [slowPosts]);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
    });

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        console.log("🧹 Cleared interval on unmount");
      }
    };
  }, []);

  const toggleSwitch = () => {
    setIsOn((prev) => !prev);
    if (!hasInteracted.current) {
      hasInteracted.current = true;

      if (!intervalStarted.current) {
        console.log("⏳ Starting infinite auto-toggle");
        intervalStarted.current = true;

        intervalId.current = setInterval(() => {
          buttonRef.current?.click();
        }, 500); // adjust as needed

        // Optional: cleanup on unmount
        // Save interval ID to ref if you plan to clear it later
      }
    }
  };

  const slowPostsLoad = () => {
    console.log("Start fetch Slow");
    const slowContent = fetchSlow(); // This returns JSX
    console.log("End fetch Slow");
    startTransition(() => {
      setSlowPosts(slowContent); // low priority
    });
  };

  return (
    <div className="App">
      <h1>User Profiles</h1>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <button onClick={slowPostsLoad}> Fetch Slow Posts</button>
        <button
          ref={buttonRef}
          onClick={() => {
            toggleSwitch();
            // slowPostsLoad()
          }}
        >
          {isOn ? "Turn OFF" : "Turn ON"}
        </button>
        <p>Status: {isOn ? "🔴🟠🟡🟢🔵🟣 ON" : "🟤🟤🟤🟤 OFF"}</p>
      </div>

      <Suspense fallback={<p>Loading components...</p>}>
        <SearchableUsers users={users} />
      </Suspense>
      {isPending ? (
        <p>Loading posts...</p>
      ) : (
        <div style={{ marginTop: "30px" }}>{slowPosts}</div>
      )}
    </div>
  );
}

export default App;

/* 
React Lazy Loading: optimize performance by reducing your initial JavaScript bundle size, allows code splitting

Code Splitting is a technique where you split your large JavaScript bundle into smaller chunks that can be loaded on demand — instead of loading everything upfront.
In React, this helps improve performance and load time, especially for large apps.

Imagine a large component that the user doesn’t immediately need (like a dashboard or settings tab). Instead of bundling everything upfront, you can defer loading that component until it's actually needed.

React.lazy() imports components only when they are required
Suspense provides a fallback which is visible until the component is important
SearchableUsers component is imported only when required
Therefore, first in the UI, we will see "Loading Components"
Then SearchableUsers component is imported -> search input is visible
But UserCard Component is imported only when required
So search input and "Loading Search results is visible"
Then UserCard component is imported and all cards are visible */

/*
Item in a website which load fast and which load slow:

Load slow:
- Huge List
- Dashboard
- Spreadsheet
- Navigations
- "Bigger" UI Units

Load Fast:
- Input Fields
- Buttons
- Menus
- Sliders
- "Smaller" UI units

The fast parts get coupled with slow fast and reponsiveness of the user interaction with the slow parts reduces. This creates bad user experience.

For example, a huge data list is loading in the UI. As a result the input field also gets hanged or freezes and doesn't work until the entire list loads. 
*/

/**
The solution to the above Problem is Concurrent React.
Its does this with help of two things:
Interruptibility + Prioritization

State changes are divided into two parts:
- High priority renders : Synchronous, Blocking, Non-Interruptible, Interrupt low priority renders
Example: User typing in search field should be one after other without lag, seamless without freezing, and high priority 

- Low Priority Renders : Asynchronous, Non-blocking, Interruptible, Run after high priority renders
Example: A huge list loading can afford delaying, can be interrupted, low priority, doesn't require immediate response.
 */
