'use client';

const Loom = () => {
  return (
    <div style={{ position: 'relative', paddingBottom: '62.5%', height: 0 }}>
      <iframe
        src="https://www.loom.com/embed/679eefb452f640c3af83e25ce36a695a?sid=84bd60fd-df78-49a9-9cd0-80363dbb057f"
        allowFullScreen={true}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      ></iframe>
    </div>
  );
};

export default Loom;
