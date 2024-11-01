const Company = require('../../models/company');

class CompanyController {
    //[GET] /company/:id/edit
    edit = async (req, res) => {
        try {
            // Lấy ID từ URL
            const companyId = req.params.id;

            // Tìm công ty theo ID
            const company = await Company.findById(companyId);

            // Kiểm tra xem có tìm thấy công ty không
            if (!company) {
                return res.status(404).json({ message: 'Company not found' });
            }

            
            res.render('company/edit', { company });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'This id is not exist' });
        }
    };

    //[POST] /company/:id/edit
    postEditCompany = async (req, res) => {
        try {
            const companyId = req.params.id;

            // Cập nhật thông tin công ty
            await Company.findByIdAndUpdate(companyId, {
                company_name: req.body.company_name,
                location: req.body.location,
                company_description: req.body.company_description,
                company_TIN: req.body.company_TIN,
                company_website: req.body.company_website,
                company_email: req.body.company_email,
                company_phone: req.body.company_phone,
                company_address: {
                    detail: req.body.addressDetail,
                    ward: req.body.ward,
                    district: req.body.district,
                    province: req.body.province,
                    country: req.body.country,
                },
            });

            // Tạm thời chuyển hướng về trang ban đầu, sau này có profile của công ty thì trả về trang chủ công ty
            res.redirect('/');
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    };
}

module.exports = new CompanyController();
