import { useEffect, useState } from "react";
import { gallery } from "../../src/data/profile";
import { art } from "../../src/utils/art";

const PLUS = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const CAM = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

function Gallery() {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(gallery.store) || "[]") || [];
    } catch {
      return [];
    }
  });

  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(gallery.store, JSON.stringify(saved));
    } catch {
      setMessage("Photo updated, but it is too large to be saved.");
    }
  }, [saved]);

  const getSrc = (index) =>
    saved[index] || gallery.photos[index] || "";

  function handleFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const scale = Math.min(
          1,
          1400 / Math.max(image.width, image.height)
        );

        const canvas = document.createElement("canvas");

        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");

        context.fillStyle = "#fff";
        context.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const newImage = canvas.toDataURL(
          "image/jpeg",
          0.82
        );

        setSaved((previous) => {
          const next = [...previous];
          next[selected] = newImage;
          return next;
        });

        setMessage(
          "Photo updated and saved in this browser."
        );
      };

      image.onerror = () => {
        setMessage(
          "That image could not be read. Try another one."
        );
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  }

  function resetGallery() {
    setSaved([]);
    localStorage.removeItem(gallery.store);
    setMessage("Photos reset.");
  }

  return (
    <section id="gallery">
      <div className="head">
        <h2>Gallery</h2>

        {gallery.editable && (
          <button
            className="shuffle"
            type="button"
            onClick={resetGallery}
          >
            Reset photos
          </button>
        )}
      </div>

      {gallery.editable && (
        <p className="hint">
          Click any tile to add or change a photo.
        </p>
      )}

      <div className="gallery" id="gallery-grid">
        {gallery.captions.slice(0, 5).map((caption, index) => {
          const src = getSrc(index);

          return (
            <button
              className={`shot g${index + 1}${src ? "" : " blank"}`}
              type="button"
              key={caption}
              onClick={() => {
                setSelected(index);
                document.getElementById("photo-input").click();
              }}
              aria-label={`${src ? "Change" : "Add"} photo: ${caption}`}
            >
              <img
                src={src || art(index * 53 + 17, false)}
                alt={src ? caption : ""}
                loading="lazy"
              />

              <span className="cap">{caption}</span>

              <span className="chg">
                {src ? (
                  <>
                    {CAM} Change photo
                  </>
                ) : (
                  <>
                    {PLUS} Add photo
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p id="g-msg" role="status">
        {message}
      </p>

      <input
        id="photo-input"
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />
    </section>
  );
}

export default Gallery;
