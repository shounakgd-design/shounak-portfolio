function SectionHeader({ title, action }) {
  return (
    <div className="head">
      <h2>{title}</h2>
      {action}
    </div>
  );
}

export default SectionHeader;
