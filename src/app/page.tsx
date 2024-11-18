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
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Your App
        </Typography>
        <ol>
          <li>
            <Typography variant="body1">
              Get started by editing <code>src/app/page.js</code>.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">Save and see your changes instantly.</Typography>
          </li>
        </ol>

        <div className={styles.ctas}>
          <Button
            variant="contained"
            color="primary"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primary}
          >
            Deploy now
          </Button>
          <Button
            variant="outlined"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </Button>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
      <div>
        <Button variant="contained" color="primary">
          Primary Button
        </Button>
        <Button variant="outlined" color="secondary">
          Secondary Button
        </Button>
      </div>
      <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stock Info App
        </Typography>
        <SearchBar />
      </Container>
    </div>
  );
}