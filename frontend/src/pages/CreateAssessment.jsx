import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { employeeService, competencyService, assessmentService } from '../services';
import Layout from '../components/Layout';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedEmployee = searchParams.get('employee');
  
  const [employees, setEmployees] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    employee: preSelectedEmployee || '',
    competencyRatings: [],
    notes: ''
  });

  // Function to get color for each category
  const getCategoryColor = (category) => {
    const colors = {
      'Technical / Operational': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Behavioral/ Performance competencies': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Hygiene & Bar Standards': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Leadership & Personal Development/ Other Skills': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Set pre-selected employee when available
    if (preSelectedEmployee) {
      setFormData(prev => ({
        ...prev,
        employee: preSelectedEmployee
      }));
    }
  }, [preSelectedEmployee]);

  const loadData = async () => {
    try {
      const [empRes, compRes] = await Promise.all([
        employeeService.getAll(),
        competencyService.getAll()
      ]);
      
      if (empRes.success) setEmployees(empRes.data);
      if (compRes.success) {
        setCompetencies(compRes.data);
        
        // Initialize ratings with all competencies
        const ratings = compRes.data.map(comp => ({
          competency: comp._id,
          competencyId: comp.id,
          competencyName: comp.nameVi,
          ratedLevel: 'Low',
          levelNumber: 2,
          comment: ''
        }));
        setFormData(prev => ({ ...prev, competencyRatings: ratings }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (index, field, value) => {
    const newRatings = [...formData.competencyRatings];
    newRatings[index][field] = value;
    
    // Update levelNumber based on ratedLevel
    if (field === 'ratedLevel') {
      const levelMap = { 'Critical': 1, 'Low': 2, 'Medium': 3, 'High': 4 };
      newRatings[index].levelNumber = levelMap[value];
    }
    
    setFormData({ ...formData, competencyRatings: newRatings });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employee) {
      alert('Vui lòng chọn nhân viên');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await assessmentService.create(formData);
      if (response.success) {
        alert('Tạo đánh giá thành công!');
        navigate(`/employees/${formData.employee}`);
      } else {
        alert('Lỗi: ' + response.message);
      }
    } catch (error) {
      alert('Lỗi khi tạo đánh giá: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">
          Tạo đánh giá năng lực mới
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Đánh giá năng lực nhân viên theo 36 competencies
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Selection */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chọn nhân viên cần đánh giá *
          </label>
          <select
            value={formData.employee}
            onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.employeeId} - {emp.name} ({emp.position}) - {emp.store?.name}
              </option>
            ))}
          </select>
        </div>

        {/* Competency Ratings */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Đánh giá từng năng lực ({competencies.length} competencies)
          </h2>
          
          <div className="space-y-6">
            {formData.competencyRatings.map((rating, index) => {
              const comp = competencies.find(c => c._id === rating.competency);
              
              if (!comp) return null;
              
              return (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <div className="mb-3">
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded mb-3 ${getCategoryColor(comp.category)}`}>
                      {comp.category}
                    </span>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {index + 1}. {comp.nameVi}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {comp.definition}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mức độ đạt được *
                      </label>
                      <select
                        value={rating.ratedLevel}
                        onChange={(e) => handleRatingChange(index, 'ratedLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                      >
                        <option value="Critical">Level 1</option>
                        <option value="Low">Level 2</option>
                        <option value="Medium">Level 3</option>
                        <option value="High">Level 4</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nhận xét (tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={rating.comment}
                        onChange={(e) => handleRatingChange(index, 'comment', e.target.value)}
                        placeholder="Ví dụ: Cần cải thiện kỹ năng..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Notes */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ghi chú tổng quan (tùy chọn)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            placeholder="Nhận xét chung về nhân viên, điểm mạnh, điểm cần cải thiện..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Lưu ý:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Hệ thống sẽ tự động tính overall score và classification</li>
                <li>Classification được tính dựa trên trung bình các level đánh giá</li>
                <li>Kết quả sẽ được lưu vào hồ sơ nhân viên</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                <span>Lưu đánh giá</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default CreateAssessment;
