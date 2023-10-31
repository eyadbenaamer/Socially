import { useEffect, useState } from "react";

const DateInput = (props) => {
  const { setData } = props;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  const [date, setDate] = useState({
    day: `${currentDay}`,
    month: `${currentMonth + 1}`,
    year: `${currentYear - 5}`,
  });
  const birthDate = `${date.year}-${date.month}-${date.day}`;
  useEffect(() => {
    setData((prev) => ({ ...prev, birthDate }));
  }, [birthDate, setData]);
  let dayArray = [],
    monthArray = [],
    yearArray = [];
  for (let i = 1; i <= 31; i++) {
    dayArray.push(`${i < 10 ? 0 : ""}${i}`);
  }
  for (let i = 1; i <= 12; i++) {
    monthArray.push(`${i < 10 ? 0 : ""}${i}`);
  }
  for (let i = currentYear - 5; i >= currentYear - 150; i--) {
    yearArray.push(`${i}`);
  }
  const handleChange = (e) => {
    setDate({ ...date, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <select name="day" value={date.day} onChange={handleChange}>
        {dayArray.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <select name="month" value={date.month} onChange={handleChange}>
        {monthArray.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
      <select name="year" value={date.year} onChange={handleChange}>
        {yearArray.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateInput;
