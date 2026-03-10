interface DateCardPros {
  title: string;
  date?: string;
  duration?: string;
}

export const DateCard = ({title, date, duration}: DateCardPros) => {
  return (
    <div className="flex-1 space-y-4 border border-stroke bg-accent rounded-md p-5">
      <p className="text-sm font-semibold text-text2Color">{title}</p>
      <p className="text-lg font-semibold text-text3Color">{date}</p>
      <p className="text-sm font-semibold text-text4Color">{duration}</p>
    </div>
  );
};
