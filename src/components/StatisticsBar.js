import Image from "next/image";

// "250+" -> { number: "250", plus: true }; the "+" is rendered as a superscript.
function splitValue(value) {
  const trimmed = String(value ?? "").trim();
  const plus = trimmed.endsWith("+");
  return { number: plus ? trimmed.slice(0, -1).trim() : trimmed, plus };
}

export default function StatisticsBar({ locations = [], stats = [] }) {
  if (!stats.length) return null;

  return (
    <section data-section="statistics" className="statistics_bar">
      {locations.length ? (
        <div className="statistics_locations">
          {locations.map((location, index) => (
            <span key={`${location}-${index}`}>{location}</span>
          ))}
        </div>
      ) : null}
      <div className="statistics_grid">
        {stats.map((stat) => {
          const { number, plus } = splitValue(stat.value);

          return (
            <div
              className={`statistics_item${stat.icon ? " statistics_item--icon" : ""}`}
              key={stat.id}
            >
              {stat.icon ? (
                <Image
                  src={stat.icon.url}
                  alt={stat.icon.alt}
                  width={stat.icon.width}
                  height={stat.icon.height}
                  className="statistics_icon dark_img"
                />
              ) : null}
              {number ? (
                <div className="statistics_value">
                  {number}
                  {plus ? <sup>+</sup> : null}
                </div>
              ) : null}
              <div className="statistics_label">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
