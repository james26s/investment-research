"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Paper,
  Card,
  CardContent,
  Box,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Drawer,
  IconButton,
  Tooltip,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import data from "../../data/stocks.json";
import glossaryData from "../../data/glossary.json";
import sourceData from "../../data/sources.json";

// Enhanced interfaces
interface Term {
  term: string;
  definition: string;
  position: {
    start: number;
    end: number;
  };
}

interface Source {
  text: string;
  source: {
    document: string;
    page: number;
    section: string;
    url?: string;
    excerpt: string;
  };
  position: {
    start: number;
    end: number;
  };
}

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  description: string;
  detailedDescription: string;
  terms?: Term[];
  sources?: Source[];
  financials: {
    revenue: number;
    netIncome: number;
    eps: number;
    peRatio: number;
  };
}

// Styled components
// ... existing styled components ...

// Define StyledPaper as a styled component
const StyledPaper = styled(Paper)`
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
`;

// Define MetricCard as a styled component
const MetricCard = styled(Card)(({ theme }) => ({
  height: '100%',
  '& .MuiCardContent-root': {
    height: '80%',
  },
}));

// Define SidePanel as a styled component
const SidePanel = styled('div')`
  width: 300px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const ViewModeToggle = styled(ToggleButtonGroup)`
  // Add any custom styles if needed
`;

// Define HighlightSpan as a styled component
const HighlightSpan = styled('span')<{ mode: 'learn' | 'analysis' }>`
  background-color: ${({ mode }) => (mode === 'learn' ? '#ffeb3b' : '#c8e6c9')};
  cursor: pointer;
`;

const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

export default function StockPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const stock = data.find((item: Stock) => item.symbol === symbol);

  // Merge terms and sources with the stock data
  const terms = glossaryData.terms.filter(term => stock?.detailedDescription.includes(term.term));
  const sources = sourceData.sources.filter(source => stock?.detailedDescription.includes(source.text));

  const [viewMode, setViewMode] = useState<'reader' | 'learn' | 'analysis'>('reader');
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelContent, setSidePanelContent] = useState<{
    title: string;
    content: string;
    source?: any;
  } | null>(null);

  if (!stock) {
    return (
      <Box p={3}>
        <Typography variant="h4" color="error">
          Stock not found
        </Typography>
      </Box>
    );
  }

  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'reader' | 'learn' | 'analysis' | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
      setSidePanelOpen(false);
    }
  };

  const handleTermClick = (term: Term) => {
    setSidePanelContent({
      title: term.term,
      content: term.definition,
    });
    setSidePanelOpen(true);
  };

  const handleSourceClick = (source: Source) => {
    setSidePanelContent({
      title: 'Source',
      content: source.source.excerpt,
      source: source.source,
    });
    setSidePanelOpen(true);
  };

  const renderDescription = () => {
    if (viewMode === 'reader') {
      return <ReactMarkdown>{stock.detailedDescription}</ReactMarkdown>;
    }

    let text = stock.detailedDescription;
    const highlights: Array<{ start: number; end: number; content: Term | Source }> = [];

    if (viewMode === 'learn' && terms) {
      highlights.push(...terms.map(term => ({
        start: term.position.start,
        end: term.position.end,
        content: term,
      })));
    }

    if (viewMode === 'analysis' && sources) {
      highlights.push(...sources.map(source => ({
        start: source.position.start,
        end: source.position.end,
        content: source,
      })));
    }

    // Sort highlights by start position
    highlights.sort((a, b) => a.start - b.start);

    // Build the highlighted text
    let lastIndex = 0;
    const elements: JSX.Element[] = [];

    highlights.forEach((highlight, index) => {
      // Add non-highlighted text before this highlight
      if (lastIndex < highlight.start) {
        elements.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      elements.push(
        <HighlightSpan
          key={`highlight-${index}`}
          mode={viewMode}
          onClick={() => 
            viewMode === 'learn' 
              ? handleTermClick(highlight.content as Term)
              : handleSourceClick(highlight.content as Source)
          }
        >
          {text.slice(highlight.start, highlight.end)}
        </HighlightSpan>
      );

      lastIndex = highlight.end;
    });

    // Add any remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key="text-final">{text.slice(lastIndex)}</span>
      );
    }

    return <div>{elements}</div>;
  };

  const isPositiveChange = stock.change >= 0;
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      {/* Header Section */}
      <StyledPaper elevation={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" gutterBottom>
              {stock.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {stock.symbol}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <Typography variant="h4" component="span">
                ${stock.price.toFixed(2)}
              </Typography>
              <Chip
                icon={isPositiveChange ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={`${isPositiveChange ? '+' : ''}${stock.change} (${stock.percentChange}%)`}
                color={isPositiveChange ? "success" : "error"}
                sx={{ ml: 2 }}
              />
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Key Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Revenue
              </Typography>
              <Typography variant="h6">
                {formatLargeNumber(stock.financials.revenue)}
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Net Income
              </Typography>
              <Typography variant="h6">
                {formatLargeNumber(stock.financials.netIncome)}
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                EPS
              </Typography>
              <Typography variant="h6">
                ${stock.financials.eps.toFixed(2)}
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                P/E Ratio
              </Typography>
              <Typography variant="h6">
                {stock.financials.peRatio.toFixed(2)}
              </Typography>
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Company Overview Section */}
      {stock.detailedDescription && (
        <StyledPaper elevation={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Company Overview
            </Typography>
            <ViewModeToggle
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="reader">
                Reader
              </ToggleButton>
              <ToggleButton value="learn">
                Learn
              </ToggleButton>
              <ToggleButton value="analysis">
                Analysis
              </ToggleButton>
            </ViewModeToggle>
          </Box>
          <Box sx={{ 
            '& p': { mb: 2 },
            '& strong': { fontWeight: 'bold' },
            '& ul': { pl: 3, mb: 2 },
            '& li': { mb: 1 },
          }}>
            {renderDescription()}
          </Box>
        </StyledPaper>
      )}

      {/* Side Panel */}
      <Drawer
        anchor="right"
        open={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
      >
        <SidePanel>
          <div className="header">
            <Typography variant="h6">{sidePanelContent?.title}</Typography>
            <IconButton onClick={() => setSidePanelOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <Typography variant="body1" paragraph>
            {sidePanelContent?.content}
          </Typography>
          {sidePanelContent?.source && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Source: {sidePanelContent.source.document}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Section: {sidePanelContent.source.section}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Page: {sidePanelContent.source.page}
              </Typography>
              {sidePanelContent.source.url && (
                <Typography variant="body2" color="primary">
                  <a href={sidePanelContent.source.url} target="_blank" rel="noopener noreferrer">
                    View Source Document
                  </a>
                </Typography>
              )}
            </Box>
          )}
        </SidePanel>
      </Drawer>
    </Box>
  );
}