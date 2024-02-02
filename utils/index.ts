export async function getUsers() {
  const response = await fetch("http://localhost:8080/users", {
    method: "GET",
  });
  console.log("Response:", response);
  const data = await response.json();
  console.log("Data:", data);
  return data;
}
