import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function SelectShow() {
  const navigate = useNavigate();
  const { id: movieId } = useParams();
  const routerLocation = useLocation();
  const movie = routerLocation.state?.movie;
  // category passed forward from the Home page's search/filter selection
  const passedCategory = routerLocation.state?.category || movie?.category || "";

  // ---------- RAW DATA (fetched once) ----------
  const [allCinemas, setAllCinemas] = useState([]); // every cinema from API
  const [allScreens, setAllScreens] = useState([]); // every screen for this movie
  const [allShows, setAllShows] = useState([]); // every show for this movie

  // ---------- FLOW STATE ----------
  const [selectedLocation, setSelectedLocation] = useState(""); // city
  const [selectedCinema, setSelectedCinema] = useState(null); // cinema object
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);

  // ---------- UI STATE ----------
  const [showLocationPopup, setShowLocationPopup] = useState(true); // ask location first, BookMyShow style
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------- DAY / NIGHT INDICATOR STATE ----------
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000); // refresh every minute
    return () => clearInterval(timer);
  }, []);
  const currentHour = now.getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18; // 6 AM - 6 PM = day

  const CITIES = ["Surat", "Ahmedabad", "Mumbai", "Vadodara", "Rajkot"];

  // ================= HELPER: normalize any date value to "YYYY-MM-DD" (local) =================
  const toDateKey = (value) => {
    if (!value) return "";

    // if it's already a plain "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss..." string,
    // grab the date part directly WITHOUT going through `new Date()` — this avoids
    // UTC -> local timezone shifting a date by ±1 day (the #1 cause of "new show
    // doesn't show up" bugs when the backend sends plain date strings).
    if (typeof value === "string") {
      const directMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (directMatch) {
        return `${directMatch[1]}-${directMatch[2]}-${directMatch[3]}`;
      }
    }

    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value).substring(0, 10);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // helper to read a cinema's city no matter what the backend calls the field
  const getCinemaCity = (cinema) => cinema?.city || cinema?.location || cinema?.town || "";

  // helper to read a screen's cinema id no matter what the backend calls the field
  const getScreenCinemaId = (screen) => screen?.cinema_id ?? screen?.cinemaId ?? screen?.cinema?.id;

  // ================= HELPER: convert 24-hour "HH:MM" to 12-hour "H:MM AM/PM" =================
  const formatTo12Hour = (hour24, minute) => {
    let hour = parseInt(hour24, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;
    return `${hour}:${String(minute).padStart(2, "0")} ${ampm}`;
  };

  // helper to read a show's display time no matter what the backend calls the field / format
  // NOW RETURNS AM/PM FORMAT (e.g. "2:30 PM") INSTEAD OF 24-HOUR
  const getShowTime = (show) => {
    // try common field names first
    const raw =
      show?.show_time ??
      show?.showTime ??
      show?.time ??
      show?.start_time ??
      show?.startTime ??
      "";

    if (!raw) {
      // last resort: some backends only send a combined datetime in show_date
      const dt = show?.show_date || show?.date || show?.showDate;
      if (dt) {
        const d = new Date(dt);
        if (!isNaN(d.getTime())) {
          return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
        }
      }
      return "No Time";
    }

    // if raw is already a clean "HH:MM" / "HH:MM:SS" string, convert to 12-hour AM/PM
    if (typeof raw === "string") {
      const match = raw.match(/^(\d{1,2}):(\d{2})/);
      if (match) return formatTo12Hour(match[1], match[2]);
      // if it's a full ISO datetime string, format it
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
      }
      return raw; // fallback: show whatever string it is
    }

    // if raw is a Date object
    if (raw instanceof Date && !isNaN(raw.getTime())) {
      return raw.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    }

    return "No Time";
  };

  // ================= HELPER: get a show's own hour (0-23) so each show-time
  // button can decide its OWN sun/moon icon, independent of the top badge =================
  const getShowHour = (show) => {
    const raw =
      show?.show_time ??
      show?.showTime ??
      show?.time ??
      show?.start_time ??
      show?.startTime ??
      "";

    if (typeof raw === "string" && raw) {
      const match = raw.match(/^(\d{1,2}):(\d{2})/);
      if (match) return parseInt(match[1], 10);
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return d.getHours();
    }

    if (raw instanceof Date && !isNaN(raw.getTime())) return raw.getHours();

    // fallback: combined datetime field
    const dt = show?.show_date || show?.date || show?.showDate;
    if (dt) {
      const d = new Date(dt);
      if (!isNaN(d.getTime())) return d.getHours();
    }

    return null; // unknown — caller should handle gracefully
  };

  // ================= HELPER: is this specific show a day show or a night show =================
  const isShowDayTime = (show) => {
    const hour = getShowHour(show);
    if (hour === null) return true; // default to day icon if we can't tell
    return hour >= 6 && hour < 18; // 6 AM - 6 PM = day
  };

  // ================= INITIAL FETCH (cinemas + screens + shows for this movie) =================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const [cinemaRes, screenRes, showRes] = await Promise.all([
          api.get(`/cinemas`),
          api.get("/screens"),
          api.get(`/shows/movie/${movieId}`),
        ]);

        const cinemasData = cinemaRes.data || [];
        const screensData = screenRes.data || [];
        const showsData = showRes.data || [];

        // 👇 DEBUG: open browser console (F12) and check these logs
        console.log("RAW cinemas[0]:", cinemasData[0]);
        console.log("RAW screens[0]:", screensData[0]);
        console.log("RAW shows[0]:", showsData[0]);
        console.log("RAW shows (all):", showsData);

        setAllCinemas(cinemasData);
        setAllScreens(screensData);
        setAllShows(showsData);
      } catch (err) {
        console.log(err);
        setError("Failed to load show data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [movieId]);

  // ============= DATES (next 7 days) =================
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({ value: toDateKey(date), label: date.toDateString() });
    }
    return dates;
  };
  const [dates] = useState(generateDates());

  // ================= DERIVED: cinemas available in the selected city =================
  const cinemasInLocation = selectedLocation
    ? allCinemas.filter((c) => getCinemaCity(c).toLowerCase() === selectedLocation.toLowerCase())
    : [];

  // ================= HELPER: screens that belong to a given cinema (with fallback) =================
const getScreensForCinema = (cinema) => {
  if (!cinema) return [];
  return allScreens.filter((s) => String(getScreenCinemaId(s)) === String(cinema.id));
};

  // ================= HELPER: shows for a given cinema on the selected date =================


const getShowsForCinemaOnDate = (cinema) => {

  console.log("CURRENT CINEMA:", cinema);
  console.log("SELECTED DATE:", selectedDate);

  console.log(
    "ALL SHOWS:",
    allShows.map(s => ({
      id:s.id,
      screen_id:s.screen_id,
      date:s.show_date,
      time:s.show_time
    }))
  );

  console.log(
    "ALL SCREENS:",
    allScreens.map(s=>({
      id:s.id,
      cinema_id:s.cinema_id,
      name:s.name
    }))
  );


  if (!cinema || !selectedDate) return [];

  const filtered = allShows.filter((show) => {

    const screen = allScreens.find(
      s => Number(s.id) === Number(show.screen_id)
    );

    const matchesCinema =
      Number(screen?.cinema_id) === Number(cinema.id);

    const matchesDate =
      toDateKey(show.show_date) === selectedDate;

    return matchesCinema && matchesDate;
  });


  // remove duplicate show_time
  const uniqueShows = [
    ...new Map(
      filtered.map(show => [
        `${show.screen_id}-${getShowTime(show)}`,
        show
      ])
    ).values()
  ];


  // Sort Morning → Afternoon → Night
  uniqueShows.sort((a, b) => {

    const getMinutes = (show) => {

      const raw =
        show?.show_time ||
        show?.showTime ||
        show?.time ||
        "";

      if (!raw) return 0;

      const [hour, minute] = raw.split(":");

      return Number(hour) * 60 + Number(minute);
    };


    return getMinutes(a) - getMinutes(b);
  });


  return uniqueShows;
};
  // ================= DERIVED: screens belonging to the currently selected cinema =================
  const screensInCinema = getScreensForCinema(selectedCinema);

  // ================= DERIVED: screen(s) matching the selected show =================
  const screensMatchedToShow = selectedShow?.screen_id
    ? screensInCinema.filter((s) => Number(s.id) === Number(selectedShow.screen_id))
    : screensInCinema;

  // fallback: if the selected show's screen_id doesn't strictly match any screen
  // (e.g. a newly added screen with a mismatched/missing id link), don't hide
  // everything — fall back to all screens in this cinema so it still displays.
  const filteredScreens = screensMatchedToShow.length > 0 ? screensMatchedToShow : screensInCinema;

  // ================= HANDLERS =================
  const handleLocationSelect = (city) => {
    setSelectedLocation(city);
    setSelectedDate("");
    setSelectedCinema(null);
    setSelectedShow(null);
    setSelectedScreen(null);
    setShowLocationPopup(false);
  };

  // Date is selected first (right after location, like BookMyShow's date strip).
  // Changing the date invalidates whatever cinema/show/screen was picked.
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedCinema(null);
    setSelectedShow(null);
    setSelectedScreen(null);
  };

  // Clicking a show-time button (inside a cinema's card) selects BOTH the
  // cinema and the show together in one step — matches the BookMyShow flow
  // where cinema + showtime are picked as a single action.
  // Screen is no longer shown as a separate step on this page, so we auto-pick
  // it here based on the show's screen_id (falls back to the cinema's first screen).
  const handleShowSelect = (show, cinema) => {
    setSelectedCinema(cinema);
    setSelectedShow(show);

    const matchedScreen = allScreens.find((s) => Number(s.id) === Number(show?.screen_id));
    const cinemaScreens = getScreensForCinema(cinema);
    setSelectedScreen(matchedScreen || cinemaScreens[0] || null);
  };

  const handleContinue = () => {
    if (!selectedLocation || !selectedCinema || !selectedDate || !selectedShow || !selectedScreen) {
      alert("Please select Location, Date, Cinema/Show time & Screen");
      return;
    }

    navigate(`/seat-selection/${movieId}`, {
      state: {
        movie,
        show: selectedShow,
        screen: selectedScreen,
        cinema: selectedCinema,
        date: selectedDate,
        location: selectedLocation,
        address: selectedCinema?.address || selectedCinema?.name || selectedLocation,
      },
    });
  };

  // ================= UI =================
  return (
    <div style={styles.page}>
      {/* ================= TOP NAV BAR (BookMyShow style) ================= */}
      <div style={styles.navBar}>
        <div style={styles.navLeft}>
          <span style={styles.navBack} onClick={() => navigate(-1)}>←</span>
          <div>
            <div style={styles.navTitleRow}>
              <span style={styles.navTitle}>{movie?.title || movie?.name || "Select Show"}</span>
              {passedCategory && <span style={styles.categoryBadge}>{passedCategory}</span>}
            </div>
            <div style={styles.navSubtitle}>
              📍 {selectedLocation || "Select location"}
              <span style={styles.navChangeLoc} onClick={() => setShowLocationPopup(true)}>
                Change
              </span>
            </div>
          </div>
        </div>

        {/* ================= DAY / NIGHT INDICATOR ================= */}
        <div
          style={{
            ...styles.dayNightBadge,
            background: isDayTime ? "rgba(255,178,56,0.12)" : "rgba(120,140,255,0.12)",
            border: `1px solid ${isDayTime ? "#FFB238" : "#7C8CFF"}`,
            color: isDayTime ? "#FFD65C" : "#C9CFFF",
          }}
          title={isDayTime ? "Good day!" : "Good night!"}
        >
          <span style={{ fontSize: "16px", lineHeight: 1 }}>{isDayTime ? "☀️" : "🌙"}</span>
          <span>{isDayTime ? "Day" : "Night"}</span>
        </div>
      </div>

      <div style={styles.content}>
        {error && <p style={styles.error}>{error}</p>}
        {loading && <p style={styles.loadingText}>Loading shows…</p>}

        {/* ================= DATE STRIP (sticky, BookMyShow rail style) ================= */}
        {selectedLocation && (
          <div style={styles.dateRail}>
            {dates.map((d) => (
              <button
                key={d.value}
                onClick={() => handleDateChange(d.value)}
                style={{
                  ...styles.dateChip,
                  ...(selectedDate === d.value ? styles.dateChipActive : {}),
                }}
              >
                <span style={styles.dateChipDay}>
                  {d.label.split(" ")[0]}
                </span>
                <span style={styles.dateChipNum}>{d.label.split(" ")[2]}</span>
                <span style={styles.dateChipMonth}>{d.label.split(" ")[1]}</span>
              </button>
            ))}
          </div>
        )}

        {/* ================= CINEMAS + INLINE SHOW TIMES (BookMyShow style) ================= */}
        {selectedDate && (
          <div style={styles.cinemaList}>
            <div style={styles.sectionLabel}>
              CINEMAS IN {selectedLocation?.toUpperCase()}
              <span style={styles.legendWrap}>
                <span style={styles.legendItem}><span style={{...styles.legendDot, background:"#FFB238"}} /> ☀️ Day</span>
                <span style={styles.legendItem}><span style={{...styles.legendDot, background:"#7C8CFF"}} /> 🌙 Night</span>
              </span>
            </div>

            {cinemasInLocation.length > 0 ? (
              cinemasInLocation.map((c) => {
                const showsForThisCinema = getShowsForCinemaOnDate(c);
                return (
                  <div key={c.id} style={styles.cinemaCard}>
                    <div style={styles.cinemaHeaderRow}>
                      <div>
                        <div style={styles.cinemaName}>{c.name}</div>
                        <div style={styles.cinemaAddress}>
                          {c.address || c.city}
                          <span
                            onClick={() => {
                              const query = encodeURIComponent(
                                `${c.name} ${c.address || ""} ${c.city || selectedLocation}`
                              );
                              window.open(
                                `https://www.google.com/maps/search/?api=1&query=${query}`,
                                "_blank"
                              );
                            }}
                            title="View on Map"
                            style={styles.mapPin}
                          >
                            
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.showtimeRow}>
                      {showsForThisCinema.length > 0 ? (
                        showsForThisCinema.map((s) => {
                          const isActive = selectedShow?.id === s.id && selectedCinema?.id === c.id;
                          const day = isShowDayTime(s);
                          return (
                            <button
                              key={s.id}
                              onClick={() => handleShowSelect(s, c)}
                              style={{
                                ...styles.showChip,
                                ...(isActive ? styles.showChipActive : {}),
                                borderColor: isActive ? "#e50914" : day ? "#FFB23855" : "#7C8CFF55",
                              }}
                            >
                              <span style={{ marginRight: "6px" }}>{day ? "☀️" : "🌙"}</span>
                              {getShowTime(s)}
                            </button>
                          );
                        })
                      ) : (
                        <p style={styles.noShowsText}></p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={styles.noShowsText}>No cinemas found in {selectedLocation}</p>
            )}
          </div>
        )}
      </div>

      {/* ================= LOCATION POPUP ================= */}
      {showLocationPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupBox}>
            <h3 style={{ marginTop: 0 }}>Select Your City</h3>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginTop: "20px" }}>
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => handleLocationSelect(city)}
                  style={{
                    padding: "12px 20px",
          
                    borderRadius: "25px",
                    border: selectedLocation === city ? "2px solid #e50914" : "1px solid #475569",
                    background: selectedLocation === city ? "#e50914" : "#1f2937",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  📍 {city}
                </button>
              ))}
            </div>
            {selectedLocation && (
              <button onClick={() => setShowLocationPopup(false)} style={styles.cancelBtn}>
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================ STICKY BOTTOM BAR (BookMyShow checkout-bar style) ================= */}
      {selectedShow && (
        <div style={styles.bottomBar}>
          <div style={styles.bottomBarInfo}>
            <div style={styles.bottomBarCinema}>{selectedCinema?.name}</div>
            <div style={styles.bottomBarShow}>
              {isShowDayTime(selectedShow) ? "☀️" : "🌙"} {getShowTime(selectedShow)} · {selectedDate}
            </div>
          </div>
          <button onClick={handleContinue} style={styles.continueBtn}>
            Continue ➜ Select Seats
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0c1016",
    color: "#fff",
    fontFamily: "'Segoe UI', Inter, Arial, sans-serif",
    position: "relative",
    paddingBottom: "90px", // room for sticky bottom bar
  },

  // ---------- Top nav bar ----------
  navBar: {
    position: "sticky",
    top: 0,
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    background: "#14181f",
    borderBottom: "1px solid #232a35",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navBack: {
    fontSize: "22px",
    cursor: "pointer",
    color: "#cbd5e1",
    userSelect: "none",
  },
  navTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  navTitle: {
    fontSize: "19px",
    fontWeight: "800",
    letterSpacing: "0.2px",
  },
  categoryBadge: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.4px",
    color: "#ffb238",
    background: "rgba(255,178,56,0.12)",
    border: "1px solid #FFB23855",
    padding: "3px 10px",
    borderRadius: "999px",
    textTransform: "uppercase",
  },
  navSubtitle: {
    fontSize: "12.5px",
    color: "#94a3b8",
    marginTop: "2px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  navChangeLoc: {
    color: "#e50914",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "12px",
  },

  dayNightBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.3px",
    backdropFilter: "blur(6px)",
    userSelect: "none",
    transition: "all 0.6s ease",
    flexShrink: 0,
  },

  content: {
    padding: "24px 24px 0",
    maxWidth: "980px",
    margin: "0 auto",
  },

  // ---------- Date rail ----------
  dateRail: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    paddingBottom: "18px",
    marginBottom: "20px",
    borderBottom: "1px solid #1e2530",
  },
  dateChip: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "64px",
    padding: "10px 6px",
    borderRadius: "12px",
    border: "1px solid #2a3140",
    background: "#171c25",
    color: "#e5e7eb",
    cursor: "pointer",
    lineHeight: 1.2,
    transition: "0.2s",
  },
  dateChipActive: {
    background: "#e50914",
    borderColor: "#e50914",
    color: "#fff",
    boxShadow: "0 6px 16px rgba(229,9,20,.4)",
  },
  dateChipDay: { fontSize: "11px", fontWeight: 600, opacity: 0.85 },
  dateChipNum: { fontSize: "18px", fontWeight: 800 },
  dateChipMonth: { fontSize: "10.5px", opacity: 0.85 },

  // ---------- Cinema list ----------
  cinemaList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sectionLabel: {
    fontSize: "12.5px",
    fontWeight: 700,
    letterSpacing: "0.6px",
    color: "#94a3b8",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "8px",
  },
  legendWrap: { display: "flex", gap: "14px", fontWeight: 500, letterSpacing: 0 },
  legendItem: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" },
  legendDot: { width: "8px", height: "8px", borderRadius: "50%", display: "inline-block" },

  cinemaCard: {
    background: "#141922",
    border: "1px solid #232a35",
    borderRadius: "16px",
    padding: "18px 20px",
    transition: "border-color 0.2s",
  },
  cinemaHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  cinemaName: {
    fontSize: "16.5px",
    fontWeight: 700,
  },
  cinemaAddress: {
    fontSize: "12.5px",
    color: "#8b96a5",
    marginTop: "3px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  mapPin: { cursor: "pointer" },

  showtimeRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },showChip: {
  padding: "9px 16px",
  borderRadius: "10px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#2a3140",
  background: "#0f1520",
  color: "#e5e7eb",
  cursor: "pointer",
  fontSize: "13.5px",
  fontWeight: "600",
  transition: "0.2s",
},
  showChipActive: {
    background: "linear-gradient(135deg,#e50914,#ff416c)",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(229,9,20,.45)",
    transform: "translateY(-2px)",
  },
  noShowsText: {
    color: "#64748b",
    fontSize: "13.5px",
    margin: 0,
  },
  loadingText: {
    color: "#94a3b8",
    padding: "20px 0",
  },

  // ---------- Location popup ----------
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  popupBox: {
    background: "#111827",
    padding: "30px",
    borderRadius: "20px",
    width: "350px",
    color: "white",
  },
  cancelBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#374151",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  // ---------- Sticky bottom checkout bar ----------
  bottomBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#14181f",
    borderTop: "1px solid #232a35",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 40,
    boxShadow: "0 -8px 24px rgba(0,0,0,.35)",
  },
  bottomBarInfo: { lineHeight: 1.3 },
  bottomBarCinema: { fontWeight: 700, fontSize: "14.5px" },
  bottomBarShow: { fontSize: "12.5px", color: "#94a3b8", marginTop: "2px" },

  continueBtn: {
    padding: "13px 34px",
    borderRadius: "30px",
    border: "none",
    background: "linear-gradient(135deg,#e50914,#b91c1c)",
    color: "#fff",
    fontSize: "15.5px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 22px rgba(229,9,20,.5)",
  },

  error: {
    background: "#991b1b",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
};