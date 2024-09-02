import { object, string } from "zod";

const UserSchema = object({
  name: string({
    required_error: "Name is required",
  }).min(3),
  email: string({
    required_error: "Email is required",
  }).email("Invalid email format"),
  password: string({
    required_error: "Password is required",
  }).min(8, "Password must be at least 8 characters long"),
  role: string({
    required_error: "Role is required",
  }).min(3).refine(value => value === "superadmin" || value === "user", "Invalid role"),
});

export default UserSchema;