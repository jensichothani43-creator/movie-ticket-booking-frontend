import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../css/movieDetail.css";

export default function MovieDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);


  useEffect(() => {

    const fetchMovie = async () => {

      try {

        const res = await api.get(`/movies/${id}`);

        setMovie(res.data);

      } catch (err) {

        console.log(err);

      }

    };


    fetchMovie();

  }, [id]);



  if (!movie) {

    return <h2>Loading...</h2>;

  }



  const autoRating = movie.id
    ? (Number(movie.id) % 5) + 1
    : 4;




  const handleBook = () => {

    console.log("MOVIE SEND TO SHOW:", movie);


    navigate(`/shows/${movie.id}`, {

      state: {

        movie: movie

      }

    });

  };





  return (

    <div className="movie-detail">


      <img
        src={movie.image}
        alt={movie.name}
      />



      <div className="detail-info">


        <h1>
          {movie.name}
        </h1>



        <div className="rating">

          <span>
            {"⭐".repeat(autoRating)}
          </span>


          <strong>
            {" "}
            {autoRating}/5
          </strong>

        </div>




        <h3>
          Category : {movie.category}
        </h3>




        <p>
          {movie.description}
        </p>





        <button
          onClick={handleBook}
        >
          🎟 Book Ticket
        </button>



      </div>


    </div>

  );

}