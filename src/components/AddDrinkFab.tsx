import { Link } from "react-router-dom";
import { PlusIcon } from "./icons";

export default function AddDrinkFab({ to }: { to: string }) {
  return (
    <Link to={to} aria-label="Log a drink" className="nu-fab">
      <PlusIcon className="h-6 w-6" />
    </Link>
  );
}
