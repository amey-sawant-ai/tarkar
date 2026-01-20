export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  image: string;
  rating: number;
  date: string;
  isApproved: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Very good taste, delicious food! The quality and flavors are exceptional.",
    author: "Divya Gharat",
    role: "Zomato Reviewer",
    avatar: "DG",
    image: "/Tarkari-image.png",
    rating: 5,
    date: "2024-11-15",
    isApproved: true,
  },
  {
    id: "2",
    quote:
      "Great recommendations! The staff really knows how to suggest the best dishes.",
    author: "Ratikanta Malik",
    role: "Food Lover",
    avatar: "RM",
    image: "/Tarkari-image.png",
    rating: 5,
    date: "2024-11-10",
    isApproved: true,
  },
  {
    id: "3",
    quote:
      "The dal khichdi is absolutely amazing! A must-try dish at Tarkari.",
    author: "Ajay Malik",
    role: "Regular Customer",
    avatar: "AM",
    image: "/Tarkari-image.png",
    rating: 5,
    date: "2024-11-08",
    isApproved: true,
  },
  {
    id: "4",
    quote:
      "Mouth watering food! The dal khichdi creates such a wonderful mood and dining experience.",
    author: "Kartika Behera",
    role: "Food Enthusiast",
    avatar: "KB",
    image: "/Tarkari-image.png",
    rating: 5,
    date: "2024-11-05",
    isApproved: true,
  },
  {
    id: "5",
    quote:
      "Amazing pure vegetarian food! The paneer dishes are especially delicious. Highly recommend the Paneer Butter Masala.",
    author: "Priya Sharma",
    role: "Regular Customer",
    avatar: "PS",
    image: "/Tarkari-image.png",
    rating: 5,
    date: "2024-11-20",
    isApproved: true,
  },
  {
    id: "6",
    quote:
      "The South Indian breakfast is authentic and tasty. The dosas are crispy and the sambhar is perfect!",
    author: "Ramesh Kumar",
    role: "Food Blogger",
    avatar: "RK",
    image: "/Tarkari-image.png",
    rating: 4,
    date: "2024-11-18",
    isApproved: true,
  },
  {
    id: "7",
    quote:
      "Family-friendly atmosphere with great service. The thali is value for money with so many varieties!",
    author: "Sneha Patil",
    role: "Local Resident",
    avatar: "SP",
    image: "/Tarkari-image.png",
    rating: 5,
    date: "2024-11-12",
    isApproved: true,
  },
  {
    id: "8",
    quote:
      "The Chinese section is surprisingly good! The Manchurian is perfectly spiced.",
    author: "Vikram Desai",
    role: "Food Enthusiast",
    avatar: "VD",
    image: "/Tarkari-image.png",
    rating: 4,
    date: "2024-11-03",
    isApproved: true,
  },
];

export const getApprovedTestimonials = () => {
  return testimonials.filter((t) => t.isApproved);
};

export const getRecentTestimonials = (count: number = 4) => {
  return getApprovedTestimonials()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};

export const getAverageRating = () => {
  const approved = getApprovedTestimonials();
  if (approved.length === 0) return 0;
  const sum = approved.reduce((acc, t) => acc + t.rating, 0);
  return (sum / approved.length).toFixed(1);
};
