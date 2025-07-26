// src/components/SearchableUsers.jsx
import React, { useState } from "react";
import { useDeferredValue, Suspense } from "react";

const UserCard = React.lazy(() => import("./UserCard"));

function SearchableUsers({ users }) {
  const [input, setInput] = useState("");
  const deferredInput = useDeferredValue(input);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(deferredInput.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search users..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Suspense fallback={<p>Loading search results...</p>}>
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </Suspense>
    </>
  );
}

export default SearchableUsers;
