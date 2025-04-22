import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
  description: "Customers overview",
};
export default function Customers() {
  return (
    <div>
      <h1>Customers</h1>
      <p>Welcome to the customers page!</p>
    </div>
  );
}
