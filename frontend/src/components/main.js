import { useEffect, useState } from "react";

const Main = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:5000/members", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch((error) => {
        console.log("Fetch error: ", error);
      });
  }, []);

  return (
    <div>
      {/* Check if data.members exists and is an array */}
      {Array.isArray(data.members) ? (
        <ul>
          {/* Use map to iterate over the array and create a list item for each member */}
          {data.members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      ) : (
        <p>No members found</p>
      )}
    </div>
  );
};

export default Main;
