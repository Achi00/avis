interface userProps {
  userId: number;
  onSelect: (userId: number, value: string) => void;
}

const Cards = ({ userId, onSelect }: userProps) => {
  // Hardcoded card values for demonstration purposes
  const cardValues = [
    {
      key: "customer_focus",
      label: "Customer Focus",
      BgColor: "#00629F",
      textColor: "#dc9346",
    },
    {
      key: "ownership",
      label: "Ownership",
      BgColor: "#f5a623",
      textColor: "#D4002A",
    },
    {
      key: "innovation",
      label: "Innovation",
      BgColor: "#e1ded9",
      textColor: "#00629f",
    },
    {
      key: "integrity",
      label: "Integrity",
      BgColor: "#65615D",
      textColor: "#e1ded9",
    },
    {
      key: "passion",
      label: "Passion",
      BgColor: "#d0021b",
      textColor: "#fff",
    },
  ];

  return (
    <div className="absolute top-0 bg-white items-center justify-center z-20 w-full h-screen flex flex-wrap">
      {cardValues.map((card) => (
        <div
          key={card.key}
          onClick={() => onSelect(userId, card.key)}
          style={{
            cursor: "pointer",
            backgroundColor: card.BgColor,
            color: card.textColor,
            margin: "10px",
            padding: "20px",
            width: "250px",
            height: "250px",
          }}
          className="cursor-pointer text-center text-white font-bold text-md flex items-center justify-center"
        >
          {card.label}
        </div>
      ))}
    </div>
  );
};

export default Cards;
