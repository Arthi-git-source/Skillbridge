const patterns = [
  {category:'Data & Analytics', words:['sales','revenue','dashboard','data','analysis','report','inventory','excel'], skills:['Excel','Power BI','SQL'], difficulty:'Intermediate', budget:{min:800,max:1500}},
  {category:'Web Development', words:['website','web','landing page','catalogue','portfolio'], skills:['React','CSS','JavaScript'], difficulty:'Intermediate', budget:{min:1500,max:3000}},
  {category:'Design', words:['poster','invitation','design','brand','catalogue','logo'], skills:['Canva','Branding'], difficulty:'Beginner', budget:{min:350,max:1400}},
  {category:'Digital Marketing', words:['instagram','social','seo','marketing','campaign'], skills:['Canva','Content','SEO'], difficulty:'Intermediate', budget:{min:900,max:1800}},
  {category:'Documents', words:['resume','document','pdf','sheets','tracker'], skills:['MS Word','Excel'], difficulty:'Beginner', budget:{min:400,max:800}},
  {category:'Technology Help', words:['workspace','email','setup','technology','support'], skills:['Google Workspace','Tech Support'], difficulty:'Beginner', budget:{min:500,max:1000}}
];

export function analyseProblem({description='', title='', category, skills=[]}, students) {
  const text = `${title} ${description}`.toLowerCase();
  const detected = patterns.reduce((best, item) => {
    const score = item.words.filter(word => text.includes(word)).length;
    return score > best.score ? {...item, score} : best;
  }, {...patterns[0], score:0});
  const requiredSkills = [...new Set([...(skills || []), ...detected.skills])];
  const recommendedStudents = students.map(student => {
    const shared = requiredSkills.filter(skill => student.skills.some(s => s.toLowerCase() === skill.toLowerCase()));
    const score = Math.min(98, Math.round(55 + (shared.length / requiredSkills.length) * 30 + student.rating * 2 + Math.min(student.completed, 15) / 5));
    return {...student, matchScore:score, matchingSkills:shared, reasons:[`${shared.length} matching skills`, `${student.completed} completed tasks`, student.availability]};
  }).sort((a,b) => b.matchScore-a.matchScore).slice(0,3);
  return {category:category || detected.category, requiredSkills, difficulty:detected.difficulty, estimatedBudget:detected.budget, recommendedStudents};
}
