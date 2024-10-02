import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Blogs from "../pages/Blogs";
import Slider from "../pages/Slider";
import Software from "../pages/Software";
import Training from "../pages/Training";
import Services from "../pages/Services";
import MainAbout from "../pages/MainAbout";
import HomeAbout from "../pages/HomeAbout";
import Profile from "../pages/Profile";
import AddBlog from "../pages/AddBlog";
import AddSlider from "../pages/AddSlider";
import AddTraining from "../pages/AddTraining";
import AddSoftware from "../pages/AddSoftware";
import HomeContact from "../pages/HomeContact";
import MainContact from "../pages/MainContact";
import Sponsors from "../pages/Sponsors";
import AddSponsor from "../pages/AddSponsor";
import AddService from "../pages/AddService";
import Faqs from "../pages/Faqs";
import AddFaq from "../pages/AddFaq";
import Reviews from "../pages/Reviews";
import AddReview from "../pages/AddReview";
import EditReview from "../pages/EditReview";
import EditBlog from "../pages/EditBlog";
import EditTraining from "../pages/EditTraining";
import EditSoftware from "../pages/EditSoftware";
import EditService from "../pages/EditService";
import EditFaq from "../pages/EditFaq";
import EditSponsor from "../pages/EditSponsor";
import EditSlider from "../pages/EditSlider";
import Promotion from "../pages/Promotion";
import AddPromotion from "../pages/AddPromotion";
import EditPromotion from "../pages/EditPromotion";
import RoadMaps from "../pages/RoadMaps";
import AddRoadMap from "../pages/AddRoadMap";
import EditRoadMap from "../pages/EditRoadMap";
import Notification from "../pages/Notification";
import AddModule from "../pages/AddModule";
import ViewModule from "../pages/ViewModule";
import EditModule from "../pages/EditModule";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
const AppRoutes = () => {
  const user = localStorage.getItem("email");

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/sliders" element={<Slider />} />
          <Route path="/sliders/add-slider" element={<AddSlider />} />
          <Route path="/sliders/edit-slider/:id" element={<EditSlider />} />
          <Route path="/main-about" element={<MainAbout />} />
          <Route path="/home-about" element={<HomeAbout />} />
          <Route path="/main-contact" element={<MainContact />} />
          <Route path="/home-contact" element={<HomeContact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/add-service" element={<AddService />} />
          <Route path="/services/edit-service/:id" element={<EditService />} />
          <Route path="/softwares" element={<Software />} />
          <Route path="/softwares/add-software" element={<AddSoftware />} />
          <Route
            path="/softwares/edit-software/:id"
            element={<EditSoftware />}
          />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/sponsors/add-sponsor" element={<AddSponsor />} />
          <Route path="/sponsors/edit-sponsor/:id" element={<EditSponsor />} />
          <Route path="/trainings" element={<Training />} />
          <Route path="/trainings/add-training" element={<AddTraining />} />
          <Route
            path="/trainings/edit-training/:id"
            element={<EditTraining />}
          />
          <Route path="/trainings/add-module/:id" element={<AddModule />} />
          <Route path="/trainings/view-module/:id" element={<ViewModule />} />
          <Route
            path="/trainings/edit-module/:id/:moduleId"
            element={<EditModule />}
          />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/add-blog" element={<AddBlog />} />
          <Route path="/blogs/edit-blog/:id" element={<EditBlog />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/add-review" element={<AddReview />} />
          <Route path="/reviews/edit-review/:id" element={<EditReview />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/faqs/add-faq" element={<AddFaq />} />
          <Route path="/faqs/edit-faq/:id" element={<EditFaq />} />
          <Route path="/road-maps" element={<RoadMaps />} />
          <Route path="/road-maps/add-road-map" element={<AddRoadMap />} />
          <Route
            path="/road-maps/edit-road-map/:id"
            element={<EditRoadMap />}
          />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/promotion/add-promotion" element={<AddPromotion />} />
          <Route
            path="/promotion/edit-promotion/:id"
            element={<EditPromotion />}
          />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
