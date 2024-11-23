interface Certificate {
  id: number;
  title: string;
  date: string;
  imageUrl: string;
}

export const pmpCertification: Certificate = {
  id: 2,
  title: "PMP",
  date: "June 2023",
  imageUrl: "/images/certifications/pmp-cert.jpg"
};

export const otherCertifications: Certificate[] = [
  {
    id: 1,
    title: "HashiCorp Certified: Terraform Associate (003)",
    date: "Nov 2023",
    imageUrl: "https://images.credly.com/size/340x340/images/85b9cfc4-257a-4742-878c-4f7ab4a2631b/image.png"
  },
  {
    id: 3,
    title: "Microsoft Azure Fundamentals",
    date: "May 2022",
    imageUrl: "https://images.credly.com/size/340x340/images/be8fcaeb-c769-4858-b567-ffaaa73ce8cf/image.png"
  },
  {
    id: 4,
    title: "AWS Certified Developer Associate",
    date: "April 2022",
    imageUrl: "https://images.credly.com/size/340x340/images/b9feab85-1a43-4f6c-99a5-631b88d5461b/image.png"
  },
  {
    id: 5,
    title: "Cisco Certified DevNet Associate",
    date: "Jan 2022",
    imageUrl: "/images/certifications/cisco-dev-cert.png"
  },
  {
    id: 6,
    title: "AWS Certified Solutions Architect – Associate",
    date: "Nov 2021",
    imageUrl: "https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png"
  },
  {
    id: 7,
    title: "PCAP – Certified Associate in Python Programming",
    date: "Sep 2021",
    imageUrl: "/images/certifications/pcap-cert.jpg"
  },
  {
    id: 8,
    title: "MCSE (Microsoft Certified Systems Engineer)",
    date: "2001",
    imageUrl: "/images/certifications/mcse-cert.png"
  }
];