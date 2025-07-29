import React from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN"; // Replace with your Mapbox token

const bobaShops = [
  {
    name: "Boba Guys",
    address: "3491 19th St, San Francisco, CA 94110",
    lat: 37.7609,
    lng: -122.4211,
  },
  {
    name: "Tea Top",
    address: "631 Clement St, San Francisco, CA 94118",
    lat: 37.7822,
    lng: -122.4641,
  },
  {
    name: "Purple Kow",
    address: "3620 Balboa St, San Francisco, CA 94121",
    lat: 37.7755,
    lng: -122.4977,
  },
];

const Map: React.FC<{ lat: number; lng: number; name: string }> = ({ lat, lng, name }) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!mapContainer.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 14,
    });
    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
    return () => map.remove();
  }, [lat, lng]);

  return <div ref={mapContainer} style={{ height: 200, width: "100%", borderRadius: 8, marginBottom: 12 }} />;
};

const StarRating: React.FC<{
  rating: number;
  onRate: (rating: number) => void;
}> = ({ rating, onRate }) => {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            color: star <= rating ? "#FFD700" : "#ddd",
            fontSize: 24,
            transition: "color 0.2s",
          }}
          onClick={() => onRate(star)}
          data-testid={`star-${star}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const BobaShops: React.FC = () => {
  const [ratings, setRatings] = React.useState<{ [name: string]: number }>({});
  const [reviewInputs, setReviewInputs] = React.useState<{ [name: string]: string }>({});
  const [reviews, setReviews] = React.useState<{ [name: string]: string }>({});

  const handleRate = (name: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [name]: rating }));
  };

  const handleReviewChange = (name: string, value: string) => {
    setReviewInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = (name: string) => {
    if (reviewInputs[name]?.trim()) {
      setReviews((prev) => ({ ...prev, [name]: reviewInputs[name] }));
      setReviewInputs((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <h1 style={{ textAlign: "center", marginBottom: 32 }}>Boba Shops</h1>
      {bobaShops.map((shop) => (
        <div key={shop.name} style={{ marginBottom: 40 }}>
          <h2 style={{ marginBottom: 4 }}>{shop.name}</h2>
          <div style={{ color: "#666", marginBottom: 8 }}>{shop.address}</div>
          <StarRating rating={ratings[shop.name] || 0} onRate={(rating) => handleRate(shop.name, rating)} />
          <Map lat={shop.lat} lng={shop.lng} name={shop.name} />

          {/* Review input */}
          <div style={{ marginTop: 12 }}>
            <textarea
              value={reviewInputs[shop.name] || ""}
              onChange={(e) => handleReviewChange(shop.name, e.target.value)}
              placeholder="Leave a review..."
              rows={3}
              style={{ width: "100%", borderRadius: 6, padding: 8, border: "1px solid #ccc", resize: "vertical", marginBottom: 8 }}
            />
            <button
              onClick={() => handleReviewSubmit(shop.name)}
              style={{ padding: "8px 16px", borderRadius: 6, background: "#4CAF50", color: "#fff", border: "none", cursor: "pointer" }}
              disabled={!reviewInputs[shop.name]?.trim()}
            >
              Submit Review
            </button>
          </div>

          {/* Display review */}
          {reviews[shop.name] && (
            <div style={{ marginTop: 10, background: "#f7f7f7", padding: 10, borderRadius: 6, color: "#333" }}>
              <strong>Your Review:</strong>
              <div>{reviews[shop.name]}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BobaShops;
