import { Grid } from "@mui/material";
import React, { useEffect } from "react";

export default function Extras() {

  useEffect(() => {
    const event = new Event("navigate");
    window.dispatchEvent(event);
  }, []);

  return (
    <section id="extras">
      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className="bg-purple-900"
        style={{ height: "450px" }}
      >
        <Grid item container
          direction="column"
          justifyContent="center"
          alignItems="flex-end" xs={6}
          style={{ height: "450px" }}
        >
          <Grid item>
            <h1 className="title-font sm:text-7xl text-3xl mb-4 font-HelloZone text-white">
              Lunar Pup Designs
            </h1>
          </Grid>
          <Grid item>
            <p className="mb-8 text-white leading-relaxed">
              Your One Stop Shop For Crafts and Branding.
              <br></br>
              Decals, Clothing Designs, Illustration, 3D Prints, etc
            </p>
          </Grid>
          <Grid item>
            <a href='https://lunarpupdesigns.square.site' target='_blank' rel='noreferrer'
              className="inline-flex text-white bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg">
              See Our Store
            </a >
          </Grid>
        </Grid>
        <Grid item container
          direction="column"
          justifyContent="center"
          alignItems="flex-start" xs={6}
          style={{ height: "450px" }}
        >
          <Grid item>
            <img
              className="object-cover object-center rounded"
              alt="LunarPups"
              src="../LPD1.png"
              style={{ height: "350px" }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className="bg-blue-500"
        style={{ height: "450px" }}
      >
        <Grid item container
          direction="column"
          justifyContent="center"
          alignItems="flex-end" xs={6}
          style={{ height: "450px" }}
        >
          <Grid item>
            <h1 className="title-font sm:text-7xl text-3xl mb-4 font-HelloZone text-white">
              Frostbite 4*4
            </h1>
          </Grid>
          <Grid item>
            <p className="mb-8 text-white leading-relaxed">
              I Own a 1990 Ford Bronco I Am Restoring.
              <br></br>
              I Am Journalling The Process on Instagram and TikTok
            </p>
          </Grid>
          <Grid item container direction="row"
            justifyContent="flex-end"
            alignItems="center" spacing={2}>
            <Grid item>
              <a href='https://linktr.ee/Frostbite4x4' target='_blank' rel='noreferrer'
                className="inline-flex text-white bg-sky-300 border-0 py-2 px-6 focus:outline-none hover:bg-sky-500 rounded text-lg">
                Follow The Journey
              </a >
            </Grid>
          </Grid>
        </Grid>
        <Grid item container
          direction="column"
          justifyContent="center"
          alignItems="flex-start" xs={6}
          style={{ height: "450px" }}
        >
          <Grid item>
            <img
              className="object-center rounded"
              alt="Frostbite"
              src="../Frostbite.svg"
              style={{ height: "250px", marginLeft: "60px" }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className="bg-zinc-900"
        style={{ height: "450px" }}
      >
        <Grid item container
          direction="column"
          justifyContent="center"
          alignItems="flex-end" xs={6}
          style={{ height: "450px" }}
        >
          <Grid item>
            <h1 className="title-font sm:text-7xl text-3xl mb-4 font-HelloZone text-white">
              Team Noir
            </h1>
          </Grid>
          <Grid item>
            <p className="mb-8 text-white leading-relaxed">
              A Nationwide Community of Automotive People
            </p>
          </Grid>
          <Grid item container direction="row"
            justifyContent="flex-end"
            alignItems="center" spacing={2}>
            <Grid item>
              <a href='https://www.instagram.com/theteamnoir/' target='_blank' rel='noreferrer'
                className="inline-flex text-white bg-slate-600 border-0 py-2 px-6 focus:outline-none hover:bg-slate-900 rounded text-lg">
                Team Noir
              </a >
            </Grid>
          </Grid>
        </Grid>
        <Grid item container
          direction="column"
          justifyContent="center"
          alignItems="flex-start" xs={6}
          style={{ height: "450px" }}
        >
          <Grid item>
            <img
              className="object-center rounded"
              alt="TeamNoir"
              src="../Noir.jpg"
              style={{ height: "250px", marginLeft: "60px" }}
            />
          </Grid>
        </Grid>
      </Grid>
    </section>
  );
}
