"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import SearchBar from './components/SearchBar'; // Assuming SearchBar is a TypeScript component

interface ButtonProps {
  variant: "contained" | "outlined";
  color: "primary" | "secondary";
}

export default function Home() {
  return (
    <div>
      <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stock Info App
        </Typography>
        <SearchBar />
      </Container>
    </div>
  );
}