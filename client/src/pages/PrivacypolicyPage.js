import React from "react";
import Spot from "../components/Spot";

const PrivacypolicyPage = () => {
  return (
    <>
      <Spot />
      <div className="ml-[130px]">
        <>
          <h1 className="font-bold text-2xl mt-[30px] ">Privacy Policy</h1>
          <p className="mt-[10px] mx-[15px]">
            This privacy policy sets out how GameHunt uses and protects any
            information that you give GameHunt when you use this website.
            GameHunt is committed to ensuring that your privacy is protected.
            Should we ask you to provide certain information by which you can be
            identified when using this website, then you can be assured that it
            will only be used in accordance with this privacy statement.
            GameHunt may change this policy from time to time by updating this
            page. You should check this page from time to time to ensure that
            you are happy with any changes.
          </p>
          <h2 className="mt-[10px] font-semibold">WHAT WE COLLECT</h2>
          <p className="mt-[10px] ml-[15px]">
            We may collect the following information:
          </p>
          <ul className="list-disc ml-[40px] my-[10px]">
            <li>name</li>
            <li>contact information including email address</li>
            <li>
              demographic information such as postcode, preferences and
              interests
            </li>
            <li>
              other information relevant to customer surveys and/or offers
            </li>
          </ul>
          <h2 className="mt-[10px] font-semibold">
            WHAT WE DO WITH THE INFORMATION WE GATHER
          </h2>
          <p className="mt-[10px] ml-[15px]">
            We require this information to understand your needs and provide you
            with a better service, and in particular for the following reasons:
          </p>
          <ul className="list-disc ml-[40px] my-[10px]">
            <li>Internal record keeping.</li>
            <li>
              We may use the information to improve our products and services.
            </li>
            <li>
              We may periodically send promotional emails about new products,
              special offers or other information which we think you may find
              interesting using the email address which you have provided.
            </li>
            <li className="mr-[15px]">
              From time to time, we may also use your information to contact you
              for market research purposes. We may contact you by email, phone,
              fax or mail. We may use the information to customise the website
              according to your interests.
            </li>
          </ul>
          <h2 className="mt-[10px]">SECURITY</h2>
          <p className="mt-[10px] ml-[15px] mr-[15px]">
            We are committed to ensuring that your information is secure. In
            order to prevent unauthorised access or disclosure, we have put in
            place suitable physical, electronic and managerial procedures to
            safeguard and secure the information we collect online.
          </p>
          <h2 className="mt-[10px] font-semibold">HOW WE USE COOKIES</h2>
          <p className="mt-[10px] ml-[15px] mr-[15px]">
            A cookie is a small file which asks permission to be placed on your
            computer's hard drive. Once you agree, the file is added and the
            cookie helps analyse web traffic or lets you know when you visit a
            particular site. Cookies allow web applications to respond to you as
            an individual. The web application can tailor its operations to your
            needs, likes and dislikes by gathering and remembering information
            about your preferences.
          </p>
          <p className="mt-[10px] ml-[15px] mr-[15px]">
            We use traffic log cookies to identify which pages are being used.
            This helps us analyse data about web page traffic and improve our
            website in order to tailor it to customer needs. We only use this
            information for statistical analysis purposes and then the data is
            removed from the system.
          </p>
          <p className="mt-[10px] ml-[15px] mr-[15px]">
            Overall, cookies help us provide you with a better website, by
            enabling us to monitor which pages you find useful and which you do
            not. A cookie in no way gives us access to your computer or any
            information about you, other than the data you choose to share with
            us. You can choose to accept or decline cookies. Most web browsers
            automatically accept cookies, but you can usually modify your
            browser setting to decline cookies if you prefer. This may prevent
            you from taking full advantage of the website.
          </p>
          <h2 className="mt-[10px] font-semibold">LINKS TO OTHER WEBSITES</h2>
          <p className="mt-[10px] ml-[15px] mr-[15px]">
            Our website may contain links to other websites of interest.
            However, once you have used these links to leave our site, you
            should note that we do not have any control over that other website.
            Therefore, we cannot be responsible for the protection and privacy
            of any information which you provide whilst visiting such sites and
            such sites are not governed by this privacy statement. You should
            exercise caution and look at the privacy statement applicable to the
            website in question.
          </p>
          <h2 className="mt-[10px] font-semibold">
            CONTROLLING YOUR PERSONAL INFORMATION
          </h2>
          <p className="mt-[10px] ml-[15px]">
            You may choose to restrict the collection or use of your personal
            information in the following ways:
          </p>
          <ul className="list-disc ml-[40px] my-[10px]">
            <li>
              whenever you are asked to fill in a form on the website, look for
              the box that you can click to indicate that you do not want the
              information to be used by anybody for direct marketing purposes
            </li>
            <li>
              if you have previously agreed to us using your personal
              information for direct marketing purposes, you may change your
              mind at any time by writing to or emailing us at
              contact@gamehunt.dev.
            </li>
          </ul>
          <p className="mt-[10px] ml-[15px] mr-[15px]">
            We will not sell, distribute or lease your personal information to
            third parties unless we have your permission or are required by law
            to do so. We may use your personal information to send you
            promotional information about third parties which we think you may
            find interesting if you tell us that you wish this to happen.
          </p>
          <p className="mt-[10px] ml-[15px] mr-[15px]">
            You may request details of personal information which we hold about
            you under the Data Protection Act 1998. A small fee will be payable.
            If you would like a copy of the information held on you please write
            to contact@gamehunt.dev.
          </p>
          <p className="mt-[10px] ml-[15px] mb-[30px] mr-[15px]">
            If you believe that any information we are holding on you is
            incorrect or incomplete, please write to or email us as soon as
            possible, at the above address. We will promptly correct any
            information found to be incorrect.
          </p>
        </>
      </div>
    </>
  );
};

export default PrivacypolicyPage;
