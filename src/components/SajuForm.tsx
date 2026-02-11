'use client';

import { useState } from 'react';

interface SajuFormProps {
    onSubmit: (data: SajuFormData) => void;
    isLoading: boolean;
}

export interface SajuFormData {
    year: string;
    month: string;
    day: string;
    isLunar: boolean;
    gender: 'male' | 'female';
    hour: number; // -1이면 모름
}

// 12시진 옵션
const SIJI_OPTIONS = [
    { value: -1, label: '모름' },
    { value: 0, label: '자시 (23:00-01:00)' },
    { value: 1, label: '축시 (01:00-03:00)' },
    { value: 2, label: '인시 (03:00-05:00)' },
    { value: 3, label: '묘시 (05:00-07:00)' },
    { value: 4, label: '진시 (07:00-09:00)' },
    { value: 5, label: '사시 (09:00-11:00)' },
    { value: 6, label: '오시 (11:00-13:00)' },
    { value: 7, label: '미시 (13:00-15:00)' },
    { value: 8, label: '신시 (15:00-17:00)' },
    { value: 9, label: '유시 (17:00-19:00)' },
    { value: 10, label: '술시 (19:00-21:00)' },
    { value: 11, label: '해시 (21:00-23:00)' },
];

// 년도 옵션 (1940-2025)
const YEAR_OPTIONS = Array.from({ length: 86 }, (_, i) => 2025 - i);

export default function SajuForm({ onSubmit, isLoading }: SajuFormProps) {
    const [formData, setFormData] = useState<SajuFormData>({
        year: '',
        month: '',
        day: '',
        isLunar: false,
        gender: 'male',
        hour: -1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.year || !formData.month || !formData.day) {
            alert('생년월일을 입력해주세요.');
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="card">
                <h2 className="card-title">📅 생년월일</h2>

                {/* 양력/음력 선택 */}
                <div className="form-group">
                    <label className="form-label">
                        달력 종류<span className="required">*</span>
                    </label>
                    <div className="radio-group">
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="solar"
                                name="calendar"
                                checked={!formData.isLunar}
                                onChange={() => setFormData({ ...formData, isLunar: false })}
                            />
                            <label htmlFor="solar">☀️ 양력</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="lunar"
                                name="calendar"
                                checked={formData.isLunar}
                                onChange={() => setFormData({ ...formData, isLunar: true })}
                            />
                            <label htmlFor="lunar">🌙 음력</label>
                        </div>
                    </div>
                </div>

                {/* 년/월/일 */}
                <div className="form-group">
                    <label className="form-label">
                        생년월일<span className="required">*</span>
                    </label>
                    <div className="form-row">
                        <select
                            className="form-select"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        >
                            <option value="">년도</option>
                            {YEAR_OPTIONS.map((year) => (
                                <option key={year} value={year}>{year}년</option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            value={formData.month}
                            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                        >
                            <option value="">월</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}월</option>
                            ))}
                        </select>
                        <select
                            className="form-select"
                            value={formData.day}
                            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                        >
                            <option value="">일</option>
                            {Array.from({ length: 31 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}일</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 성별 */}
                <div className="form-group">
                    <label className="form-label">
                        성별<span className="required">*</span>
                    </label>
                    <div className="radio-group">
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="male"
                                name="gender"
                                checked={formData.gender === 'male'}
                                onChange={() => setFormData({ ...formData, gender: 'male' })}
                            />
                            <label htmlFor="male">👨 남성</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                checked={formData.gender === 'female'}
                                onChange={() => setFormData({ ...formData, gender: 'female' })}
                            />
                            <label htmlFor="female">👩 여성</label>
                        </div>
                    </div>
                </div>

                {/* 출생시간 */}
                <div className="form-group">
                    <label className="form-label">출생시간 (선택)</label>
                    <select
                        className="form-select"
                        value={formData.hour}
                        onChange={(e) => setFormData({ ...formData, hour: parseInt(e.target.value) })}
                    >
                        {SIJI_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? '분석 중...' : '🔮 오늘의 음식 운세 보기'}
            </button>
        </form>
    );
}
