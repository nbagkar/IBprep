# IB Prep Hub

A comprehensive full-stack web application for investment banking recruiting preparation. This platform serves as a centralized dashboard for students preparing for IB recruiting, featuring firm tracking, interview preparation, resource management, and live news feeds.

## 🚀 Features

### 1. Firm Tracker
- Interactive table to track firms, deadlines, and application status
- Add/edit firms with detailed information (name, division, location, contacts, notes)
- Coffee chat scheduler with notes section
- Status tracking: Applied, Interviewing, Offer, Rejected

### 2. Interview Prep Center
- **Behavioral Q&A Bank**: Add questions and your written responses
- **Technical Q&A Section**: Categorized by valuation, accounting, DCF, LBO, market sizing
- **Mock Interview Timer**: Practice mode with countdown and prompt display
- **Deal Experience Logging**: Organize and track real-world deals to discuss

### 3. Resource Library
- Upload and categorize PDFs (WSO guides, study notes, etc.)
- Quick reference section for key formulas and concepts
- Contact manager for networking outreach
- Bookmark system for important resources

### 4. Progress Dashboard
- Visual progress tracker with charts and KPIs
- Upcoming interviews calendar with reminders
- Key metrics: firms applied, chats completed, interviews scheduled, mock sessions

### 5. Live News Feed
- Bloomberg TV integration placeholder
- RSS reader for WSJ/FT/Reuters
- Bookmark articles for later reference
- Real-time market news updates

### 6. Additional Features
- Networking event tracker
- Thank-you note template generator
- Salary and bonus comparison tools
- Personalized recruiting timeline planner

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Charts**: Recharts
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form
- **Animations**: Framer Motion

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ib-prep-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
ib-prep-hub/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── FirmTracker.tsx    # Firm tracking module
│   ├── InterviewPrep.tsx  # Interview preparation
│   ├── ResourceLibrary.tsx # Resource management
│   ├── NewsFeed.tsx       # News and RSS feeds
│   └── Sidebar.tsx        # Navigation sidebar
├── lib/                   # Utilities and store
│   └── store.ts          # Zustand store with types
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

- **Colors**: Primary blue, success green, warning yellow, danger red
- **Components**: Cards, buttons, forms, modals, tables
- **Typography**: Inter font family
- **Responsive**: Mobile-first design with desktop optimization

## 📱 Responsive Design

- **Desktop**: Full-featured layout with sidebar navigation
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Mobile-first design with touch-friendly interactions

## 💾 Data Persistence

All user data is persisted locally using:
- **Zustand Persist**: Automatic localStorage persistence
- **No Backend Required**: Works entirely client-side
- **Data Export**: Easy to backup and restore data

## 🔧 Customization

### Adding New Modules
1. Create a new component in `components/`
2. Add types to `lib/store.ts`
3. Update the sidebar navigation
4. Add the component to the main page routing

### Styling
- Modify `app/globals.css` for global styles
- Update `tailwind.config.js` for design system changes
- Use the predefined component classes for consistency

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Environment variables are handled automatically

### Other Platforms
The app can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for investment banking students and professionals
- Inspired by the need for better recruiting preparation tools
- Uses modern web technologies for optimal performance

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Check the documentation
- Review the code comments for implementation details

---

**IB Prep Hub** - Your comprehensive investment banking recruiting companion.

<!-- Updated for Vercel redeployment --> 