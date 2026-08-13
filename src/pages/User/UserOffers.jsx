import { useEffect, useState } from "react";
import api from "../../services/api";
import "./UserOffers.css";
import { useParams } from "react-router-dom";

export default function UserOffers() {

  const { movie_id } = useParams();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (movie_id) {
      fetchOffers();
    } else {
      setLoading(false);
      setError("Movie ID not found");
    }
  }, [movie_id]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError("");
console.log("movie_id =", movie_id);


      const res = await api.get(`/offers/movie/${movie_id}`);
      setOffers(res.data || []);

    } catch (err) {
      console.error(err);
      setError("Failed to load offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);

    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (loading) {
    return (
      <div className="offer-container">
        <div className="offer-hero skeleton"></div>

        <div className="offer-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="offer-card skeleton-card" key={i}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offer-error">
        <h2>❌ {error}</h2>
        <button onClick={fetchOffers}>Retry</button>
      </div>
    );
  }

  return (
    <div className="offer-container">

      <div className="offer-hero">
        <h1>🎟 Exclusive Offers</h1>
        <p>Save more on your movie bookings</p>
      </div>

      <div className="offer-grid">

        {offers.length === 0 ? (
          <div className="no-offers">
            <p>🎁 No Offers Available for this movie</p>
          </div>

        ) : (
          offers.map((offer) => (
            <div className="offer-card" key={offer.id}>

              <div className="offer-header">
                <h2>{offer.title}</h2>
              </div>

              <div className="offer-body">

                <p>{offer.description}</p>

                <div className="offer-valid">
                  ⏳ {offer.valid || "Limited Time Offer"}
                </div>

                <div className="coupon-box">
                  <input value={offer.code} readOnly />

                  <button
                    onClick={() => copyCode(offer.code, offer.id)}
                    className={copiedId === offer.id ? "copied" : ""}
                  >
                    {copiedId === offer.id ? "Copied ✓" : "Copy"}
                  </button>
                </div>

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
}