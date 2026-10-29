# නෙත්මි AI Web App

මෙය static demo එකක් නොව, **සැබෑ AI chat backend එකක් සම්බන්ධ කළ හැකි deployable web app starter එකකි**. AI chat සහ image analysis ක්‍රියාත්මක වන්නේ OpenAI API key එකක් ලබා දුන් පසු පමණි. Live AI video call එක තවම සම්බන්ධ කර නැත; ඒ සඳහා වෙනම avatar/video provider එකක් සහ credentials අවශ්‍යය.

## අවශ්‍ය දේ
- Node.js 18+
- OpenAI API key (API billing/usage අනුව ගාස්තු අය විය හැක)
- සජීවීව publish කිරීමට HTTPS සහිත hosting

## ඔබගේ පරිගණකයේ ධාවනය කිරීම
1. ZIP එක extract කරන්න.
2. Terminal/Command Prompt එකෙන් project folder එකට යන්න.
3. `npm install` ක්‍රියාත්මක කරන්න.
4. `.env.example` පිටපත් කර `.env` නමින් save කරන්න.
5. `.env` ගොනුවේ `OPENAI_API_KEY=...` ලෙස ඔබගේ API key එක දාන්න. Key එක කිසිවිටෙක `public` folder එකට නොදමන්න.
6. `npm start` ක්‍රියාත්මක කරන්න.
7. Browser එකෙන් `http://localhost:3000` විවෘත කරන්න.

## දැන් ක්‍රියාකරන දේ
- OpenAI Responses API හරහා සැබෑ සිංහල AI chat
- පණිවිඩ සමඟ image upload කර image analysis ඉල්ලීම
- Browser speech synthesis (උපාංගයේ සිංහල voice එකක් තිබීම මත රඳා පවතී)
- Browser speech recognition (browser/device support මත රඳා පවතී)

## තවම අවශ්‍ය දේ
- **Live AI video call**: avatar streaming provider එකක් තෝරා API integration එක සම්පූර්ණ කළ යුතුයි.
- **Online hosting**: hosting account එකක් සකස් කර environment variable එකක් ලෙස `OPENAI_API_KEY` එක දාන්න.
- Production සඳහා authentication, rate limits, abuse protection සහ privacy policy එකක් එකතු කිරීම නිර්දේශ කෙරේ.

## ආරක්ෂාව
- API key එක කිසිවිටෙක frontend HTML/JavaScript එකේ නොදමන්න.
- `.env` ගොනුව share හෝ commit නොකරන්න.
- AI චරිතය කල්පිත AI සහායකයෙකි; සැබෑ පුද්ගලයෙකු නොවේ.


## වැදගත්: Live Video Call
මෙම source එකේ Live Video Call තවම සම්බන්ධ කර නැත. UI එකේ එම බොත්තම disabled කර ඇත; සැබෑ video call ලෙස ව්‍යාජව පෙන්වන්නේ නැත. සජීවී AI avatar streaming provider එකක් තෝරා එහි server-side credentials සහ integration එක එක් කළ යුතුය.
