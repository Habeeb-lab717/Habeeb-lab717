import pandas as pd
import matplotlib.pyplot as plt

# Sample data: Replace with your own data or load from a CSV
skills = {
    'Skill': ['Python', 'Data Analysis', 'Machine Learning', 'AI', 'Visualization', 'SPSS'],
    'Proficiency': [95, 90, 85, 80, 88, 70]
}
df = pd.DataFrame(skills)

print("My Data Science & AI Skills:")
print(df)

# Plotting a bar chart of skills
plt.figure(figsize=(8,5))
plt.bar(df['Skill'], df['Proficiency'], color='skyblue')
plt.title('My Data Science & AI Expertise')
plt.xlabel('Skill')
plt.ylabel('Proficiency (%)')
plt.ylim(0, 100)
plt.tight_layout()
plt.show()

print("\nConnect with me for your next AI/Data project!")
