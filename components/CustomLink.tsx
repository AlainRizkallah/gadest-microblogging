import { Tooltip , CircularProgress, styled, TooltipProps, tooltipClasses, Typography, Box, Stack } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    href: any;
  };
  
  
  const CustomLink: React.FC<Props> = ({ children, href }) => {

    let [imagePreview, setImagePreview] = React.useState("");
    let [isHovering, setIsHovering] = React.useState(false);
    let inImagePreview = false;
    let inLink = false;
  
    let handleMouseEnterImage = () => {
      inImagePreview = true;
      setIsHovering(true);
    };
  
    let handleMouseLeaveImage = () => {
      inImagePreview = false;
      setIsHovering(inLink);
    };
  
    let handleMouseEnterLink = () => {
      inLink = true;
      setIsHovering(true);
    };
  
    let handleMouseLeaveLink = () => {
      inLink = false;
      setIsHovering(inImagePreview);
    };
  
    let handleFetchImage = async (url: string) => {
      let {
        data: { image },
      } = await axios.get("http://localhost:3000/api/preview", {
        params: { url },
      });
      setImagePreview(image);
    };

    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
      <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        border: '1px solid #dadde9',
        width : 360 ,
        height : imagePreview ? 240 : 120
      },
    }));
  
    React.useEffect(() => {
      handleFetchImage(href);
      return () => setImagePreview("");
    }, [href]);
  
    return (
      <HtmlTooltip
        title={
          <React.Fragment>                        
            {isHovering && (
              <a href={href}>
                <span
                  onMouseLeave={handleMouseLeaveImage}
                  onMouseEnter={handleMouseEnterImage}
                  onFocus={handleMouseEnterImage}
                  onBlur={handleMouseLeaveImage}>
                  {imagePreview ? (<Box title='loading'>
                    <Image
                      src={`data:image/jpeg;base64, ${imagePreview}`}
                      width={300} 
                      height={240}
                    /></Box>
                  ) : (
                    <Stack pt={4} direction="row" justifyContent="center" alignItems="center" title='preview'>
                      <CircularProgress />
                      </Stack >
                  )}
                </span>
              </a>
            )}
          </React.Fragment>
        }
      >
      <span>
        <Typography color='secondary'  variant="inherit" display='inline'>
        <Box sx={{ fontWeight: 'bold'}} display='inline'>
        <a
          href={href}
          onMouseEnter={handleMouseEnterLink}
          onMouseLeave={handleMouseLeaveLink}
          onFocus={handleMouseEnterLink}
          onBlur={handleMouseLeaveLink}>
          {children}
        </a>
        </Box>
        </Typography>
      </span>
      </HtmlTooltip>
    );
  }
  

  export default CustomLink;
