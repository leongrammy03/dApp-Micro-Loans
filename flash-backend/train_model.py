import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# Load the dataset
data = pd.read_csv('credit_risk_dataset.csv')
data = data.drop(['loan_grade', 'loan_percent_income', 'cb_person_default_on_file', 'cb_person_cred_hist_length'], axis=1)

# Encode categorical variables
le_person_home_ownership = LabelEncoder()
le_loan_intent = LabelEncoder()

data['person_home_ownership'] = le_person_home_ownership.fit_transform(data['person_home_ownership'])
data['loan_intent'] = le_loan_intent.fit_transform(data['loan_intent'])

# Prepare features and target variable
X = data[['person_age', 'person_income', 'person_home_ownership', 'person_emp_length', 'loan_intent', 'loan_amnt', 'loan_int_rate']]
y = data['loan_status']  # Assuming 1 if repaid, 0 otherwise

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the Random Forest Classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
print(f'Accuracy: {accuracy_score(y_test, y_pred)}')

# Save the model
joblib.dump(model, 'loan_risk_model.pkl')
