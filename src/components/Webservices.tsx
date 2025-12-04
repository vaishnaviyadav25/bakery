"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Laptop, Store, TrendingUp } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Webservices = () => {
  const router = useRouter();

  // Minimal pink aesthetic
  const primaryColor = "#D6336C"; // deep pink
  const accentColor = "#FFC1E3"; // soft pink highlight
  const backgroundColor = "#FFF0F6"; // light pink background

  const services = [
    {
      icon: <Laptop sx={{ fontSize: 40, color: primaryColor }} />,
      title: "Portfolio & Business Websites",
      description:
        "Launch a beautiful, responsive website that showcases your story and creativity.",
    },
    {
      icon: <Store sx={{ fontSize: 40, color: primaryColor }} />,
      title: "E-Commerce Store Setup",
      description:
        "Start selling online with a clean, modern store designed to boost your brand.",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: primaryColor }} />,
      title: "SEO & Digital Presence",
      description:
        "Enhance your online visibility with smart SEO, analytics, and social media setup.",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor,
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 6 },
        textAlign: "center",
      }}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: primaryColor,
            mb: 1,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Vaishi Web Studio
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: primaryColor,
            opacity: 0.8,
            mb: 5,
            maxWidth: 650,
            mx: "auto",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          We create minimal, elegant websites that reflect your style and brand aesthetic.
        </Typography>
      </motion.div>

      {/* Services section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: { xs: 3, md: 4 },
        }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
          >
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(214, 51, 108, 0.12)",
                backgroundColor: "#fff",
                width: { xs: 260, sm: 280 },
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 6px 20px rgba(214, 51, 108, 0.2)",
                  transition: "0.3s",
                },
              }}
            >
              <CardContent>
                <Box sx={{ mb: 2 }}>{service.icon}</Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: primaryColor,
                    mb: 1,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: primaryColor,
                    opacity: 0.8,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* CTA Section */}
      <Box sx={{ mt: 6 }}>
        <Button
          variant="contained"
          onClick={() => router.push("/contact")}
          sx={{
            backgroundColor: primaryColor,
            color: "#fff",
            px: 5,
            py: 1.5,
            fontWeight: 600,
            borderRadius: "30px",
            fontFamily: "'Poppins', sans-serif",
            boxShadow: "0 4px 10px rgba(214, 51, 108, 0.2)",
            "&:hover": {
              backgroundColor: accentColor,
              color: primaryColor,
              boxShadow: "0 6px 12px rgba(214, 51, 108, 0.25)",
            },
          }}
        >
          Get Your Website Built by Vaishi
        </Button>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: primaryColor,
            opacity: 0.8,
            maxWidth: 500,
            mx: "auto",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Whether you’re an artist, small business, or entrepreneur — we help you launch a digital presence that looks minimal, pink, and aesthetic.
        </Typography>
      </Box>
    </Box>
  );
};

export default Webservices;
