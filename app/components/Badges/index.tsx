import React from 'react';

const Badges = () => {
  const badges = [
    { color: 'bg-yellow-300', text: 'New!' },
    { color: 'bg-Pill-Green', text: 'Exciting!' },
    { color: 'bg-red-300', text: 'Santa!' },
    { color: 'bg-AI-Green', text: 'AI!' },
  ];

  return (
    <div className="flex space-x-3 justify-center lg:justify-normal">
      {badges.map((b, index) => (
        <div
          key={index}
          className={`${b.color} align-middle rounded-xl py-2.5 px-3 h-10 text-center text-black text-md border border-black`}
        >
          {b.text}
        </div>
      ))}
    </div>
  );
};

export default Badges;
