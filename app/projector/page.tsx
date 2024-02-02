"use client";
import React, { useEffect, useState, useRef } from "react";

interface User {
  id: number;
  name: string;
  division: string;
  location: string;
  value: string;
}

const page = () => {
  const [usersWithInterest, setUsersWithInterest] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch users with interests
  const fetchUsersWithInterest = async () => {
    try {
      const response = await fetch("http://localhost:8080/users-with-interest");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: User[] = await response.json();
      setUsersWithInterest(data);
      setLoading(false);
      // Reset the index to 0 whenever new data is fetched
      setCurrentIndex(0);
    } catch (error: any) {
      console.error("Failed to load users with interests:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithInterest();
    // Consider removing or adjusting the interval based on your needs
  }, []);

  // Effect to cycle through usersWithInterest
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // Compute the next index, looping back to 0 if at the end
        const nextIndex = (prevIndex + 1) % usersWithInterest.length;
        return nextIndex;
      });
    }, 2000); // Adjust time as needed

    return () => clearInterval(interval); // Clear the interval on cleanup
  }, [usersWithInterest.length]); // Depend on usersWithInterest.length to reset interval when data updates

  const currentUser = usersWithInterest[currentIndex];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (usersWithInterest.length === 0) return <p>No users to display.</p>;

  return (
    <div className="flex justify-center items-center h-screen">
      <div key={currentUser.id} className="text-center">
        <h1 className="text-4xl font-extrabold">{currentUser.name}</h1>
        <h2 className="text-3xl font-semibold">{currentUser.value}</h2>
      </div>
    </div>
  );
};

{
  /* <div className="flex justify-center items-center h-screen">
      <ul>
        {usersWithInterest.map((user: User) => (
          <li key={user.id} className="text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {user.name}
            </h1>
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              {user.value}
            </h2>
          </li>
        ))}
      </ul>
    </div> */
}

export default page;
