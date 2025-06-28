import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { useHoverCard } from "./HoverCardContext";
import UserHoverCard from ".";

const HoverWrapper = (props) => {
  const { profile, children } = props;
  const { _id: id } = profile;

  const myProfile = useSelector((state) => state.profile);

  const [hovered, setHovered] = useState(false);
  const closeTimer = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { activeCardId, setActiveCardId } = useHoverCard();
  const cardId = id;

  const handleMouseEnter = (e) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setTimeout(() => {
      setHovered(true);
      setActiveCardId(cardId);
      setMousePos({ x: e.clientX, y: e.clientY });
    }, 300);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setHovered(false);
      setActiveCardId(null);
    }, 300);
  };

  const showCard = activeCardId === cardId;

  useEffect(() => {
    document.querySelectorAll("*").forEach((el) => {
      el.addEventListener(
        "scroll",
        () => {
          setHovered(false);
        },
        { passive: true }
      );
    });
    return () => {
      document.querySelectorAll("*").forEach((el) => {
        el.removeEventListener("scroll", () => {
          setHovered(false);
        });
      });
    };
  }, []);

  if (myProfile?._id === id) {
    return children;
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <UserHoverCard
        profile={profile}
        onClose={handleMouseLeave}
        mousePos={mousePos}
        visible={hovered && showCard}
      />
    </div>
  );
};

export default HoverWrapper;
