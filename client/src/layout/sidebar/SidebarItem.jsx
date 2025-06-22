import { Link, useLocation } from "react-router-dom";

const SidebarItem = (props) => {
  const { to, name, children } = props;
  const location = useLocation();

  return (
    <li className="w-full hover:text-[var(--primary-color)] transition">
      <Link onClick={() => window.scrollTo({ top: 0 })} to={to}>
        <div className="bg-hovered flex gap-3 items-center px-3 py-2 rounded-xl">
          <span className="w-9">{children}</span>
          <span
            className={`${
              location.pathname === to ||
              (to === "/messages" && location.pathname.startsWith("/messages"))
                ? "text-primary"
                : ""
            }`}
          >
            {name}
          </span>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;
